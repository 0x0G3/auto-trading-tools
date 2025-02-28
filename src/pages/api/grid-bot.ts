import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { AxiosError } from "axios";
import {
  getCurrentPrice,
  getTradingPairInfo,
  adjustQuantity,
  adjustPrice,
  isValidNotional,
  fetchActiveOrders,
  placeSpotOrder,
  checkOrderStatus,
} from "../../lib/binanceApi";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

interface BotState {
  wallet: string;
  apiKey: string;
  apiSecret: string;
  symbol: string;
  investment: number;
  percentageDrop: number;
  percentageRise: number;
  intervalMs: number;
  active_orders: Order[];
  base_price: number | null;
}

interface BinanceError {
  code?: number;
  msg?: string;
}

interface Order {
  orderId: number;
  price: number;
  quantity: number;
}

async function log(wallet: string, message: string) {
  console.log(`[${new Date().toISOString()}] ${wallet}: ${message}`);
  const { error } = await supabase
    .from("grid_bot_logs")
    .insert({ wallet, message });
  if (error)
    console.error(`Supabase log error for ${wallet}: ${error.message}`);
}

async function runBot(wallet: string) {
  log(wallet, "Bot execution triggered...");
  const { data, error: stateError } = await supabase
    .from("grid_bot_state")
    .select("*")
    .eq("wallet", wallet)
    .single();
  if (stateError) {
    log(wallet, `State fetch error: ${stateError.message}`);
    return;
  }
  if (!data?.is_running) {
    log(wallet, "Bot is not set to run—skipping execution");
    return;
  }

  const {
    apiKey,
    apiSecret,
    symbol,
    investment,
    percentageDrop,
    percentageRise,
    intervalMs,
    active_orders,
    base_price,
  } = data as BotState;
  if (!apiKey || !apiSecret) {
    log(wallet, "Missing API credentials in state—cannot proceed");
    return;
  }
  console.log(
    `Running bot with apiKey: ${apiKey.slice(
      0,
      8
    )}..., apiSecret: ${apiSecret.slice(0, 8)}...`
  );
  let basePrice: number = base_price || 0;
  let activeOrders: Order[] = active_orders || [];

  try {
    basePrice = await getCurrentPrice(symbol);
    log(wallet, `Running GridBot for ${symbol}. Base price: $${basePrice}`);
    activeOrders = await fetchActiveOrders(symbol, apiKey, apiSecret);
    log(wallet, `Fetched ${activeOrders.length} active orders`);
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    log(
      wallet,
      `Initialization failed: ${
        axiosError.response?.data?.msg || axiosError.message
      }`
    );
    return;
  }

  try {
    const { minQty, stepSize, tickSize, minPrice, minNotional } =
      await getTradingPairInfo(symbol);
    log(wallet, "Trading pair info fetched successfully");

    const currentPrice = await getCurrentPrice(symbol);
    const priceDrop = ((basePrice - currentPrice) / basePrice) * 100;
    const priceRise = ((currentPrice - basePrice) / basePrice) * 100;
    log(
      wallet,
      `Current price: $${currentPrice}, Drop: ${priceDrop.toFixed(
        2
      )}%, Rise: ${priceRise.toFixed(2)}%`
    );

    for (let i = activeOrders.length - 1; i >= 0; i--) {
      const order = activeOrders[i];
      const orderStatus = await checkOrderStatus(
        symbol,
        order.orderId,
        apiKey,
        apiSecret
      );
      if (orderStatus.status === "FILLED") {
        log(
          wallet,
          `[FILLED] Buy order ${order.orderId} filled for ${order.quantity} at $${order.price}`
        );
        activeOrders.splice(i, 1);
        const sellPrice = adjustPrice(
          order.price * 1.03012,
          tickSize,
          minPrice
        );
        const sellOrder = await placeSpotOrder(
          symbol,
          "SELL",
          order.quantity,
          sellPrice,
          apiKey,
          apiSecret
        );
        log(
          wallet,
          `[SELL ORDER PLACED] Order ID: ${sellOrder.orderId}, Quantity: ${
            sellOrder.quantity
          }, Sell Price: $${sellPrice.toFixed(4)}`
        );
      }
    }

    if (priceDrop >= percentageDrop) {
      log(
        wallet,
        `[ALERT] Price dropped by ${priceDrop.toFixed(
          2
        )}% to $${currentPrice}. Placing buy order...`
      );
      let quantity = adjustQuantity(
        investment / currentPrice,
        stepSize,
        minQty
      );
      let price = adjustPrice(currentPrice * 0.99, tickSize, minPrice);
      if (isValidNotional(quantity, price, minNotional)) {
        const buyOrder = await placeSpotOrder(
          symbol,
          "BUY",
          quantity,
          price,
          apiKey,
          apiSecret
        );
        log(
          wallet,
          `Buy order placed successfully. Order ID: ${buyOrder.orderId}`
        );
        activeOrders.push({
          orderId: buyOrder.orderId,
          quantity: buyOrder.quantity,
          price,
        });
        basePrice = currentPrice;
      } else {
        log(
          wallet,
          `Order notional value too low (min: ${minNotional}). Skipping order.`
        );
      }
    } else if (priceRise >= percentageRise) {
      log(
        wallet,
        `[INFO] Price rose by ${priceRise.toFixed(
          2
        )}% to $${currentPrice}. Updating base price...`
      );
      basePrice = currentPrice;
    }

    await supabase
      .from("grid_bot_state")
      .update({ active_orders: activeOrders, base_price: basePrice })
      .eq("wallet", wallet);
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    log(
      wallet,
      `Execution error: ${axiosError.response?.data?.msg || axiosError.message}`
    );
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { wallet } = req.query as { wallet?: string };

  if (req.method === "POST") {
    const {
      apiKey,
      apiSecret,
      symbol,
      investment,
      percentageDrop,
      percentageRise,
      intervalMs,
      action,
    } = req.body;
    if (!wallet || !apiKey || !apiSecret) {
      console.log("Missing parameters:", { wallet, apiKey, apiSecret });
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (action === "start") {
      console.log(`Starting bot for wallet: ${wallet}`);
      const { error } = await supabase.from("grid_bot_state").upsert({
        wallet,
        is_running: true,
        symbol,
        investment,
        percentage_drop: percentageDrop,
        percentage_rise: percentageRise,
        interval_ms: intervalMs,
        active_orders: [],
        base_price: null,
        apiKey,
        apiSecret,
      });
      if (error) {
        console.error(`Supabase upsert error: ${error.message}`);
        return res.status(500).json({ error: "Failed to update bot state" });
      }
      runBot(wallet);
      return res.status(200).json({ message: "Bot started" });
    } else if (action === "stop") {
      console.log(`Stopping bot for wallet: ${wallet}`);
      const { error } = await supabase
        .from("grid_bot_state")
        .update({ is_running: false })
        .eq("wallet", wallet);
      if (error) {
        console.error(`Supabase update error: ${error.message}`);
        return res.status(500).json({ error: "Failed to stop bot" });
      }
      return res.status(200).json({ message: "Bot stopped" });
    }
    console.log("Invalid action:", action);
    return res.status(400).json({ error: "Invalid action" });
  }

  if (req.method === "GET") {
    if (!wallet) return res.status(400).json({ error: "Wallet required" });
    const { data } = await supabase
      .from("grid_bot_state")
      .select("*")
      .eq("wallet", wallet)
      .single();
    const logs = await supabase
      .from("grid_bot_logs")
      .select("*")
      .eq("wallet", wallet)
      .order("timestamp", { ascending: false })
      .limit(50);
    console.log(`GET state for ${wallet}:`, data, "Logs:", logs.data);
    if (data?.is_running) {
      runBot(wallet);
    }
    return res.status(200).json({ state: data, logs: logs.data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
