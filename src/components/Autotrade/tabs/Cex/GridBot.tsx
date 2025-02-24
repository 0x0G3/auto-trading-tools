import React, { useState, useEffect } from "react";
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
} from "../../../../lib/binanceApi"; // Adjust path

interface GridBotProps {
  apiKey: string | null;
  apiSecret: string | null;
  log: (message: string) => void;
  updatePriceHistory: (price: number) => void;
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
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

export default function GridBot({
  apiKey,
  apiSecret,
  log,
  updatePriceHistory,
  setActiveOrders,
  setError,
}: GridBotProps) {
  const [symbol, setSymbol] = useState("DOGEUSDT");
  const [investment, setInvestment] = useState(2);
  const [percentageDrop, setPercentageDrop] = useState(0.6);
  const [percentageRise, setPercentageRise] = useState(1.2);
  const [intervalMs, setIntervalMs] = useState(2 * 60 * 1000); // 2 min
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!apiKey || !apiSecret || !isRunning) return;

    const startGridBot = async () => {
      if (!apiKey || !apiSecret) return; // Type guard for TS
      log(
        `Starting GridBot for ${symbol}. Monitoring for a ${percentageDrop}% drop and ${percentageRise}% rise...`
      );
      let basePrice: number;
      let activeOrders: Order[] = [];

      try {
        basePrice = await getCurrentPrice(symbol);
        log(`Base price set to $${basePrice}`);
        activeOrders = await fetchActiveOrders(symbol, apiKey, apiSecret);
        setActiveOrders(activeOrders);
        log(`Fetched ${activeOrders.length} active orders`);
        updatePriceHistory(basePrice);
      } catch (err) {
        const axiosError = err as AxiosError<BinanceError>;
        const errorMessage =
          axiosError.response?.data?.msg ||
          axiosError.message ||
          "Unknown error";
        setError(errorMessage);
        log(`Error initializing: ${errorMessage}`);
        setIsRunning(false);
        return;
      }

      const { minQty, stepSize, tickSize, minPrice, minNotional } =
        await getTradingPairInfo(symbol);

      const interval = setInterval(async () => {
        try {
          const currentPrice = await getCurrentPrice(symbol);
          updatePriceHistory(currentPrice);
          const priceDrop = ((basePrice - currentPrice) / basePrice) * 100;
          const priceRise = ((currentPrice - basePrice) / basePrice) * 100;
          log(
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
                `[SELL ORDER PLACED] Order ID: ${
                  sellOrder.orderId
                }, Quantity: ${
                  sellOrder.quantity
                }, Sell Price: $${sellPrice.toFixed(4)}`
              );
            }
          }
          setActiveOrders([...activeOrders]);

          if (priceDrop >= percentageDrop) {
            log(
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
                `Order notional value too low (min: ${minNotional}). Skipping order.`
              );
            }
          } else if (priceRise >= percentageRise) {
            log(
              `[INFO] Price rose by ${priceRise.toFixed(
                2
              )}% to $${currentPrice}. Updating base price...`
            );
            basePrice = currentPrice;
          }
        } catch (err) {
          const axiosError = err as AxiosError<BinanceError>;
          const errorMessage =
            axiosError.response?.data?.msg ||
            axiosError.message ||
            "Unknown error";
          setError(errorMessage);
          log(`Error during monitoring: ${errorMessage}`);
          setIsRunning(false);
        }
      }, intervalMs);

      return () => clearInterval(interval);
    };

    startGridBot();
  }, [
    isRunning,
    apiKey,
    apiSecret,
    symbol,
    percentageDrop,
    percentageRise,
    investment,
    intervalMs,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div>
          <label className="text-sm">Symbol:</label>
          <select
            className="select select-bordered w-32"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            disabled={isRunning}
          >
            <option value="DOGEUSDT">DOGE/USDT</option>
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Investment (USDT):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="1"
          />
        </div>
        <div>
          <label className="text-sm">Drop (%):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={percentageDrop}
            onChange={(e) => setPercentageDrop(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="0.1"
            max="10"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm">Rise (%):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={percentageRise}
            onChange={(e) => setPercentageRise(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="0.1"
            max="10"
            step="0.1"
          />
        </div>
      </div>
      <button
        className={`btn ${isRunning ? "btn-error" : "btn-primary"}`}
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Stop Bot" : "Start Bot"}
      </button>
    </div>
  );
}
