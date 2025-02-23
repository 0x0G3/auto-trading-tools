import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (tokenAddress: string) => Promise<void>;
  removeFromWatchlist: (tokenAddress: string) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    console.log(
      "WatchlistProvider useEffect - isConnected:",
      isConnected,
      "address:",
      address
    );
    if (!isConnected || !address) {
      setWatchlist([]);
      return;
    }

    const fetchWatchlist = async () => {
      console.log("Fetching watchlist for wallet:", address);
      try {
        const res = await fetch(`/api/watchlist?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch watchlist");
        const { tokens } = await res.json();
        console.log("Fetched watchlist:", tokens);
        setWatchlist(tokens || []);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      }
    };
    fetchWatchlist();
  }, [isConnected, address]);

  const addToWatchlist = async (tokenAddress: string) => {
    console.log(
      "addToWatchlist called - isConnected:",
      isConnected,
      "address:",
      address,
      "tokenAddress:",
      tokenAddress
    );
    if (!isConnected || !address) {
      console.log("Cannot add to watchlist - not connected or no address");
      return;
    }
    if (watchlist.includes(tokenAddress)) {
      console.log("Token already in watchlist:", tokenAddress);
      return;
    }
    const newWatchlist = [...watchlist, tokenAddress];
    const payload = { wallet: address, tokens: newWatchlist };
    console.log("Sending POST to /api/watchlist:", payload);
    const body = JSON.stringify(payload);
    console.log("Stringified POST body:", body); // Extra log to verify
    setWatchlist(newWatchlist);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      const responseData = await res.json();
      console.log("POST /api/watchlist response:", res.status, responseData);
      if (!res.ok)
        throw new Error(responseData.error || "Failed to save watchlist");
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      setWatchlist(watchlist); // Revert on error
    }
  };

  const removeFromWatchlist = async (tokenAddress: string) => {
    console.log(
      "removeFromWatchlist called - isConnected:",
      isConnected,
      "address:",
      address,
      "tokenAddress:",
      tokenAddress
    );
    if (!isConnected || !address) {
      console.log("Cannot remove from watchlist - not connected or no address");
      return;
    }
    const newWatchlist = watchlist.filter((addr) => addr !== tokenAddress);
    const payload = { wallet: address, tokens: newWatchlist };
    console.log("Sending POST to /api/watchlist:", payload);
    const body = JSON.stringify(payload);
    console.log("Stringified POST body:", body); // Extra log to verify
    setWatchlist(newWatchlist);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      const responseData = await res.json();
      console.log("POST /api/watchlist response:", res.status, responseData);
      if (!res.ok)
        throw new Error(responseData.error || "Failed to save watchlist");
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      setWatchlist(watchlist); // Revert on error
    }
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context)
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  return context;
};
