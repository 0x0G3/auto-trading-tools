import React, { useState, useEffect } from "react";
import { Transaction } from "../../../../lib/fetchActivity";
import ActivityCard from "./ActivityCard";
import { ethers } from "ethers";
import { useAuth } from "../../../../context/AuthContext";
import ActivityMenu from "../../Menu/ActivityMenu";

export default function Activity() {
  const { address } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const loadActivity = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/activity?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch activity");
        const txs: Transaction[] = await res.json();
        setTransactions(txs);
        setFilteredTransactions(txs);
      } catch (err) {
        setError((err as Error).message || "Failed to load activity");
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [address]);

  const handleFilter = (range: string) => {
    const [min, max] = range.split("-").map(Number);
    const filtered = transactions.filter((tx) => {
      const valueInEther = parseFloat(ethers.formatEther(tx.value));
      const valueInUsd = valueInEther * 2000; // Rough estimate - refine later
      return valueInUsd >= min && valueInUsd <= max;
    });
    setFilteredTransactions(filtered);
  };

  const handleBuy = () => {
    console.log("Buy clicked - implement swap later"); // Keep this for now
  };

  if (!address)
    return <div className="p-4">Connect wallet to see activity</div>;
  if (loading) return <div className="p-4">Loading activity...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <ActivityMenu onFilter={handleFilter} onBuy={handleBuy} />
      <h2 className="text-xl font-semibold mb-4">Wallet Activity (Base)</h2>
      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <ActivityCard key={tx.hash} transaction={tx} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No activity in this range.</p>
      )}
    </div>
  );
}
