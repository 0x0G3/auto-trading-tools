import React, { useState } from "react";
import { useBinance } from "../../../../context/BinanceContext"; // Adjust path

export default function CexMenu() {
  const { saveBinanceKeys, clearBinanceKeys, apiKey, apiSecret } = useBinance();
  const [newApiKey, setNewApiKey] = useState("");
  const [newApiSecret, setNewApiSecret] = useState("");

  const handleSave = () => {
    if (newApiKey.trim() && newApiSecret.trim()) {
      saveBinanceKeys(newApiKey.trim(), newApiSecret.trim());
      setNewApiKey("");
      setNewApiSecret("");
    } else {
      alert("Please enter both API key and secret");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {apiKey && apiSecret ? (
        <>
          <span className="text-sm text-gray-500">Binance Keys Saved</span>
          <button className="btn btn-sm btn-error" onClick={clearBinanceKeys}>
            Clear Keys
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Binance API Key"
            className="input input-bordered w-36"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
          />
          <input
            type="password"
            placeholder="Binance API Secret"
            className="input input-bordered w-36"
            value={newApiSecret}
            onChange={(e) => setNewApiSecret(e.target.value)}
          />
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </>
      )}
    </div>
  );
}
