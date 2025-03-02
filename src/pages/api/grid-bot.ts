import { createClient } from "@supabase/supabase-js";
import { AxiosError } from "axios";
import express, { RequestHandler } from "express";

const app = express();
app.use(express.json());

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
  is_running: boolean;
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

// Placeholder for Binance API functions (implement these as needed)
async function getCurrentPrice(symbol: string): Promise<number> {
  // Simulate fetching price; replace with actual Binance API call
  return 0;
}

async function getTradingPairInfo(symbol: string): Promise<{
  minQty: number;
  stepSize: number;
  tickSize: number;
  minPrice: number;
  minNotional: number;
}> {
  // Simulate fetching trading pair info
  return { minQty: 0, stepSize: 0, tickSize: 0, minPrice: 0, minNotional: 0 };
}

function adjustQuantity(
  quantity: number,
  stepSize: number,
  minQty: number
): number {
  return quantity; // Placeholder
}

function adjustPrice(
  price: number,
  tickSize: number,
  minPrice: number
): number {
  return price; // Placeholder
}

function isValidNotional(
  quantity: number,
  price: number,
  minNotional: number
): boolean {
  return true; // Placeholder
}

async function fetchActiveOrders(
  symbol: string,
  apiKey: string,
  apiSecret: string
): Promise<Order[]> {
  return []; // Placeholder
}

async function placeSpotOrder(
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number,
  price: number,
  apiKey: string,
  apiSecret: string
): Promise<Order> {
  return { orderId: 0, price, quantity }; // Placeholder
}

async function checkOrderStatus(
  symbol: string,
  orderId: number,
  apiKey: string,
  apiSecret: string
): Promise<{ status: string }> {
  return { status: "FILLED" }; // Placeholder
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
  if (!apiKey || !apiSecret || !symbol) {
    log(wallet, "Missing required state parameters");
    return;
  }

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

// Route handlers
const startHandler: RequestHandler = async (req, res) => {
  const {
    wallet,
    apiKey,
    apiSecret,
    symbols,
    investment,
    percentageDrop,
    percentageRise,
    intervalMs,
    noBuys,
  } = req.body;

  if (!wallet || !apiKey || !apiSecret || !symbols || !investment) {
    console.log("Missing parameters for start:", {
      wallet,
      apiKey,
      apiSecret,
      symbols,
      investment,
    });
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  console.log(`Starting bot for wallet: ${wallet}`);
  const { error } = await supabase.from("grid_bot_state").upsert({
    wallet,
    is_running: true,
    symbol: symbols[0], // Simplified for single ticker
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
    res.status(500).json({ error: "Failed to update bot state" });
    return;
  }

  runBot(wallet);
  res.status(200).json({ message: "Bot started" });
};

const stopHandler: RequestHandler = async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) {
    console.log("Missing wallet for stop");
    res.status(400).json({ error: "Wallet required" });
    return;
  }

  console.log(`Stopping bot for wallet: ${wallet}`);
  const { data, error: fetchError } = await supabase
    .from("grid_bot_state")
    .select("is_running")
    .eq("wallet", wallet)
    .single();

  if (fetchError || !data) {
    console.log(
      `No bot state found for wallet: ${wallet}, creating stopped state`
    );
    await supabase.from("grid_bot_state").upsert({
      wallet,
      is_running: false,
      symbol: null,
      investment: 0,
      percentage_drop: 0,
      percentage_rise: 0,
      interval_ms: 0,
      active_orders: [],
      base_price: null,
      apiKey: "",
      apiSecret: "",
    });
    res.status(200).json({ message: "No bot running, state reset" });
    return;
  }

  if (!data.is_running) {
    console.log(`Bot already stopped for wallet: ${wallet}`);
    res.status(200).json({ message: "Bot already stopped" });
    return;
  }

  const { error } = await supabase
    .from("grid_bot_state")
    .update({ is_running: false })
    .eq("wallet", wallet);
  if (error) {
    console.error(`Supabase update error: ${error.message}`);
    res.status(500).json({ error: "Failed to stop bot" });
    return;
  }

  res.status(200).json({ message: "Bot stopped" });
};

const statusHandler: RequestHandler = async (req, res) => {
  const wallet = req.query.wallet as string;
  if (!wallet) {
    res.status(400).json({ error: "Wallet required" });
    return;
  }

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
  res.status(200).json({
    states: [data],
    logs: logs.data,
    activeOrders: data?.active_orders || [],
  });
};

// Assign handlers to routes
app.post("/start", startHandler);
app.post("/stop", stopHandler);
app.get("/status", statusHandler);

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
