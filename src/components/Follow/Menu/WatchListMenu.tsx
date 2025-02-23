import React, { useState } from "react";
import { useWatchlist } from "../../../context/WatchlistContext"; // Adjust path
import { useAuth } from "../../../context/AuthContext"; // Adjust path
import ExportImportButton from "../../UI/ExportImportButton";

export default function WatchListMenu() {
  const { addToWatchlist } = useWatchlist();
  const { isConnected } = useAuth();
  const [tokenAddress, setTokenAddress] = useState("");
  const [timeframe, setTimeframe] = useState("24h");

  const handleAddToken = () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    if (tokenAddress.trim()) {
      console.log("Triggering addToWatchlist with:", tokenAddress.trim());
      addToWatchlist(tokenAddress.trim());
      setTokenAddress("");
    } else {
      alert("Please enter a token address");
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4 ml-8">
        <select
          className="select select-bordered w-24"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="1h">1h</option>
          <option value="6h">6h</option>
          <option value="24h">24h</option>
        </select>
        <input
          type="text"
          placeholder="Add Token Address"
          className="input input-bordered w-36"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddToken}>
          Add
        </button>
      </div>
      <ExportImportButton />
    </div>
  );
}
