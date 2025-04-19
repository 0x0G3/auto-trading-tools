// /home/grivas/tradingtools/auto-trading-tools/src/components/Autotrade/tabs/Cex/Smc-ict.tsx
import React, { useState, useEffect } from "react";
import { useBinance } from "../../../../context/BinanceContext";
import { GridBotProps } from "../../../../types/gridBot";

const BOT_SERVER_URL = "https://bot.auto-trading-tools.com:3006/premium";

interface SMC_ICTProps extends GridBotProps {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
  interval: string;
  setInterval: React.Dispatch<React.SetStateAction<string>>;
}

export default function SMC_ICT({
  apiKey,
  apiSecret,
  log,
  updatePriceHistory,
  setActiveOrders,
  setError,
  symbol,
  setSymbol,
  interval,
  setInterval,
}: SMC_ICTProps) {
  const [investment, setInvestment] = useState<number>(100);
  const [lookbackPeriod, setLookbackPeriod] = useState<number>(100);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const availableSymbols = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
  ];

  useEffect(() => {
    if (!apiKey || isPolling) return;

    const fetchState = async () => {
      try {
        const response = await fetch(
          `${BOT_SERVER_URL}/status?wallet=${apiKey}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const { state, logs } = await response.json();

        if (state && state.is_running) {
          setSymbol(state.symbol || "BTCUSDT");
          setInvestment(state.investment || 100);
          setLookbackPeriod(state.strategy_data?.config?.lookbackPeriod || 100);
          setInterval(state.strategy_data?.config?.interval || "1h");
          setIsRunning(true);
          logs.forEach((l: { message: string }) => log(l.message));
          setActiveOrders(state.strategy_data?.state?.activeOrders || []);
          setErrorCount(0);
        } else {
          setIsRunning(false);
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
    // Use window.setInterval to ensure browser context
    const intervalId: number = window.setInterval(fetchState, 30000);
    return () => {
      window.clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [
    apiKey,
    log,
    setActiveOrders,
    setError,
    isPolling,
    setSymbol,
    setInterval,
  ]);

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
          ...(action === "start" && {
            symbol,
            investment,
            intervalMs: 60000,
            strategy: "smc",
            strategyConfig: { lookbackPeriod, interval },
          }),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to ${action} SMC/ICT bot: ${response.status} - ${errorText}`
        );
      }
      const data = await response.json();
      log(`SMC/ICT bot ${action}ed: ${data.message}`);
      setIsRunning(action === "start");
    } catch (err) {
      setError((err as Error).message);
      log(`SMC/ICT toggle error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm">Symbol:</label>
        <select
          className="select select-bordered w-48"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          disabled={isRunning}
        >
          {availableSymbols.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <div>
          <label className="text-sm">Investment (USDT):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="10"
          />
        </div>
        <div>
          <label className="text-sm">Lookback Period (candles):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={lookbackPeriod}
            onChange={(e) => setLookbackPeriod(parseInt(e.target.value) || 0)}
            disabled={isRunning}
            min="10"
            max="500"
          />
        </div>
        <div>
          <label className="text-sm">Interval:</label>
          <select
            className="select select-bordered w-24"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            disabled={isRunning}
          >
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="btn btn-primary"
          onClick={() => handleToggleBot("start")}
          disabled={isRunning || !symbol}
        >
          Start SMC/ICT Bot
        </button>
        <button
          className="btn btn-error"
          onClick={() => handleToggleBot("stop")}
          disabled={!isRunning}
        >
          Stop SMC/ICT Bot
        </button>
      </div>
    </div>
  );
}
