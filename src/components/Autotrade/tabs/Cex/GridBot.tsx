import React, { useState, useEffect } from "react";
import { useBinance } from "../../../../context/BinanceContext";
import { GridBotProps } from "../../../../types/gridBot";

const BOT_SERVER_URL = "http://143.198.74.242:3005"; // Droplet IP

export default function GridBot({
  log,
  updatePriceHistory,
  setActiveOrders,
  setError,
}: GridBotProps) {
  const { apiKey, apiSecret } = useBinance();
  const [symbol, setSymbol] = useState("DOGEUSDT");
  const [investment, setInvestment] = useState(2);
  const [percentageDrop, setPercentageDrop] = useState(0.6);
  const [percentageRise, setPercentageRise] = useState(1.2);
  const [intervalMs, setIntervalMs] = useState(2 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [noBuys, setNoBuys] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!apiKey || isPolling) return;

    const fetchState = async () => {
      try {
        const response = await fetch(
          `${BOT_SERVER_URL}/status?wallet=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { state, logs, activeOrders } = await response.json();
        if (state) {
          setSymbol(state.symbol);
          setInvestment(state.investment);
          setPercentageDrop(state.percentage_drop);
          setPercentageRise(state.percentage_rise);
          setIntervalMs(state.interval_ms);
          setIsRunning(state.is_running);
          logs.forEach((l: { message: string }) => log(l.message));
          setActiveOrders(activeOrders);
          setErrorCount(0);
        }
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        log(`Fetch state error: ${errorMsg}`);
        setErrorCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setIsPolling(false);
            log("Stopped polling due to repeated failures");
          }
          return newCount;
        });
      }
    };

    fetchState();
    setIsPolling(true);
    const intervalId = setInterval(fetchState, 30000); // 30s poll

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [apiKey, log, setActiveOrders, setError]);

  const handleToggleBot = async (action: "start" | "stop") => {
    if (!apiKey || !apiSecret) return;
    try {
      const response = await fetch(`${BOT_SERVER_URL}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: apiKey,
          apiKey,
          apiSecret,
          symbol,
          investment,
          percentageDrop,
          percentageRise,
          intervalMs,
          noBuys,
        }),
      });
      if (!response.ok) throw new Error(`Failed to ${action} bot`);
      setIsRunning(action === "start");
    } catch (err) {
      setError((err as Error).message);
      log(`Toggle bot error: ${(err as Error).message}`);
    }
  };

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
        <div>
          <label className="text-sm">No Buys:</label>
          <input
            type="checkbox"
            className="checkbox"
            checked={noBuys}
            onChange={(e) => setNoBuys(e.target.checked)}
            disabled={isRunning}
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="btn btn-primary"
          onClick={() => handleToggleBot("start")}
          disabled={isRunning}
        >
          Start Bot
        </button>
        <button
          className="btn btn-error"
          onClick={() => handleToggleBot("stop")}
          disabled={!isRunning}
        >
          Stop Bot
        </button>
      </div>
    </div>
  );
}
