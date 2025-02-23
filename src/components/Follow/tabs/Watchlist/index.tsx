import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useWatchlist } from "../../../../context/WatchlistContext";
// import { useAuth } from "../../../../../context/AuthContext"; // Adjust path
// import { useWatchlist } from "../../../../../context/WatchlistContext"; // Adjust path

export default function Watchlist() {
  const { address } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || watchlist.length === 0) return;

    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/watchlist?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch watchlist");
        const { tokens } = await res.json();
        // Already synced via context, but could verify here if needed
      } catch (err) {
        setError((err as Error).message || "Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [address, watchlist]);

  if (!address)
    return <div className="p-4">Connect wallet to see watchlist</div>;
  if (loading) return <div className="p-4">Loading watchlist...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-gray-500">Add tokens to your watchlist</p>
      ) : (
        <div className="space-y-4">
          {watchlist.map((tokenAddr) => (
            <div
              key={tokenAddr}
              className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold">{tokenAddr}</p>
                <p className="text-xs text-gray-500">
                  Market data coming soon...
                </p>
              </div>
              <button
                className="btn btn-sm btn-error"
                onClick={() => removeFromWatchlist(tokenAddr)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
