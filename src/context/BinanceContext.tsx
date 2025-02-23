import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path

interface BinanceContextType {
  apiKey: string | null;
  apiSecret: string | null;
  saveBinanceKeys: (apiKey: string, apiSecret: string) => Promise<void>;
  clearBinanceKeys: () => Promise<void>;
}

const BinanceContext = createContext<BinanceContextType | null>(null);

export const BinanceProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setApiKey(null);
      setApiSecret(null);
      return;
    }

    const fetchBinanceKeys = async () => {
      try {
        const res = await fetch(`/api/binance-keys?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch Binance keys");
        const { api_key, api_secret } = await res.json();
        setApiKey(api_key || null);
        setApiSecret(api_secret || null);
      } catch (error) {
        console.error("Failed to fetch Binance keys:", error);
      }
    };
    fetchBinanceKeys();
  }, [isConnected, address]);

  const saveBinanceKeys = async (newApiKey: string, newApiSecret: string) => {
    if (!isConnected || !address) {
      console.log("Cannot save Binance keys - not connected or no address");
      return;
    }
    if (!newApiKey || !newApiSecret) {
      console.log("API key and secret are required");
      return;
    }
    setApiKey(newApiKey);
    setApiSecret(newApiSecret);
    try {
      const res = await fetch("/api/binance-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          api_key: newApiKey,
          api_secret: newApiSecret,
        }),
      });
      if (!res.ok) throw new Error("Failed to save Binance keys");
    } catch (error) {
      console.error("Failed to save Binance keys:", error);
      setApiKey(null);
      setApiSecret(null);
    }
  };

  const clearBinanceKeys = async () => {
    if (!isConnected || !address) return;
    setApiKey(null);
    setApiSecret(null);
    try {
      const res = await fetch("/api/binance-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      if (!res.ok) throw new Error("Failed to clear Binance keys");
    } catch (error) {
      console.error("Failed to clear Binance keys:", error);
    }
  };

  return (
    <BinanceContext.Provider
      value={{ apiKey, apiSecret, saveBinanceKeys, clearBinanceKeys }}
    >
      {children}
    </BinanceContext.Provider>
  );
};

export const useBinance = () => {
  const context = useContext(BinanceContext);
  if (!context)
    throw new Error("useBinance must be used within a BinanceProvider");
  return context;
};
