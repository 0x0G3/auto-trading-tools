import React, { useState } from "react";
import { useBinance } from "../../../../context/BinanceContext"; // Adjust path

export default function Cex() {
  const { apiKey, apiSecret } = useBinance();
  const [strategy, setStrategy] = useState<string>("grid"); // Default to grid

  const strategies = [
    { id: "grid", label: "Grid Trading" },
    // Add more later: { id: "arbitrage", label: "Arbitrage" }
  ];

  const renderStrategyContent = () => {
    switch (strategy) {
      case "grid":
        return (
          <div>
            <p className="text-gray-500">Grid Trading Bot - Coming soon...</p>
            {/* Grid bot UI/logic goes here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Binance Trading Bot</h2>
      {apiKey && apiSecret ? (
        <div>
          <p className="text-sm">API Key: {apiKey.slice(0, 8)}...</p>
          <p className="text-sm">API Secret: {apiSecret.slice(0, 8)}...</p>
          <div className="mt-4">
            <label className="text-sm font-medium mr-2">Select Strategy:</label>
            <select
              className="select select-bordered w-48"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">{renderStrategyContent()}</div>
        </div>
      ) : (
        <p className="text-gray-500">
          Enter your Binance API keys in the menu to start trading.
        </p>
      )}
    </div>
  );
}
