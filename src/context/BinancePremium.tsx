import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext"; // Adjust path as needed

interface BinancePremiumContextType {
  premiumApiKey: string | null;
  premiumApiSecret: string | null;
  savePremiumBinanceKeys: (
    apiKey: string,
    apiSecret: string
  ) => Promise<{ success: boolean; error?: string }>;
  clearPremiumBinanceKeys: () => Promise<{ success: boolean; error?: string }>;
}

const BinancePremiumContext = createContext<BinancePremiumContextType | null>(
  null
);

export const BinancePremiumProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { address, isConnected } = useAuth();
  const [premiumApiKey, setPremiumApiKey] = useState<string | null>(null);
  const [premiumApiSecret, setPremiumApiSecret] = useState<string | null>(null);

  // Fetch premium keys when connected
  useEffect(() => {
    if (!isConnected || !address) {
      setPremiumApiKey(null);
      setPremiumApiSecret(null);
      return;
    }

    const fetchPremiumBinanceKeys = async () => {
      try {
        const response = await fetch(
          `/api/binance-premium-keys?wallet=${encodeURIComponent(address)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch premium Binance keys: ${response.status}`
          );
        }

        const { api_key, api_secret } = await response.json();
        setPremiumApiKey(api_key || null);
        setPremiumApiSecret(api_secret || null);
      } catch (error) {
        console.error("Error fetching premium Binance keys:", error);
      }
    };

    fetchPremiumBinanceKeys();
  }, [isConnected, address]);

  // Save premium keys
  const savePremiumBinanceKeys = useCallback(
    async (
      newApiKey: string,
      newApiSecret: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!isConnected || !address) {
        return { success: false, error: "Not connected or no wallet address" };
      }
      if (!newApiKey || !newApiSecret) {
        return { success: false, error: "API key and secret are required" };
      }

      try {
        const response = await fetch("/api/binance-premium-keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: address,
            api_key: newApiKey,
            api_secret: newApiSecret,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to save premium Binance keys: ${response.status}`
          );
        }

        setPremiumApiKey(newApiKey);
        setPremiumApiSecret(newApiSecret);
        return { success: true };
      } catch (error) {
        console.error("Error saving premium Binance keys:", error);
        setPremiumApiKey(null);
        setPremiumApiSecret(null);
        return { success: false, error: (error as Error).message };
      }
    },
    [isConnected, address]
  );

  // Clear premium keys
  const clearPremiumBinanceKeys = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!isConnected || !address) {
      return { success: false, error: "Not connected or no wallet address" };
    }

    try {
      const response = await fetch("/api/binance-premium-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to clear premium Binance keys: ${response.status}`
        );
      }

      setPremiumApiKey(null);
      setPremiumApiSecret(null);
      return { success: true };
    } catch (error) {
      console.error("Error clearing premium Binance keys:", error);
      return { success: false, error: (error as Error).message };
    }
  }, [isConnected, address]);

  return (
    <BinancePremiumContext.Provider
      value={{
        premiumApiKey,
        premiumApiSecret,
        savePremiumBinanceKeys,
        clearPremiumBinanceKeys,
      }}
    >
      {children}
    </BinancePremiumContext.Provider>
  );
};

export const useBinancePremium = (): BinancePremiumContextType => {
  const context = useContext(BinancePremiumContext);
  if (!context) {
    throw new Error(
      "useBinancePremium must be used within a BinancePremiumProvider"
    );
  }
  return context;
};
// import {
//   createContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useContext,
// } from "react";
// import { useAuth } from "../context/AuthContext"; // Adjust path

// interface BinanceContextType {
//   apiKey: string | null;
//   apiSecret: string | null;
//   saveBinanceKeys: (apiKey: string, apiSecret: string) => Promise<void>;
//   clearBinanceKeys: () => Promise<void>;
// }

// const BinanceContext = createContext<BinanceContextType | null>(null);

// export const BinanceProvider = ({ children }: { children: ReactNode }) => {
//   const { address, isConnected } = useAuth();
//   const [apiKey, setApiKey] = useState<string | null>(null);
//   const [apiSecret, setApiSecret] = useState<string | null>(null);

//   useEffect(() => {
//     if (!isConnected || !address) {
//       setApiKey(null);
//       setApiSecret(null);
//       return;
//     }

//     const fetchBinanceKeys = async () => {
//       try {
//         const res = await fetch(`/api/binance-keys?wallet=${address}`);
//         if (!res.ok) throw new Error("Failed to fetch Binance keys");
//         const { api_key, api_secret } = await res.json();
//         setApiKey(api_key || null);
//         setApiSecret(api_secret || null);
//       } catch (error) {
//         console.error("Failed to fetch Binance keys:", error);
//       }
//     };
//     fetchBinanceKeys();
//   }, [isConnected, address]);

//   const saveBinanceKeys = async (newApiKey: string, newApiSecret: string) => {
//     if (!isConnected || !address) {
//       console.log("Cannot save Binance keys - not connected or no address");
//       return;
//     }
//     if (!newApiKey || !newApiSecret) {
//       console.log("API key and secret are required");
//       return;
//     }
//     setApiKey(newApiKey);
//     setApiSecret(newApiSecret);
//     try {
//       const res = await fetch("/api/binance-keys", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           wallet: address,
//           api_key: newApiKey,
//           api_secret: newApiSecret,
//         }),
//       });
//       if (!res.ok) throw new Error("Failed to save Binance keys");
//     } catch (error) {
//       console.error("Failed to save Binance keys:", error);
//       setApiKey(null);
//       setApiSecret(null);
//     }
//   };

//   const clearBinanceKeys = async () => {
//     if (!isConnected || !address) return;
//     setApiKey(null);
//     setApiSecret(null);
//     try {
//       const res = await fetch("/api/binance-keys", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ wallet: address }),
//       });
//       if (!res.ok) throw new Error("Failed to clear Binance keys");
//     } catch (error) {
//       console.error("Failed to clear Binance keys:", error);
//     }
//   };

//   return (
//     <BinanceContext.Provider
//       value={{ apiKey, apiSecret, saveBinanceKeys, clearBinanceKeys }}
//     >
//       {children}
//     </BinanceContext.Provider>
//   );
// };

// export const useBinance = () => {
//   const context = useContext(BinanceContext);
//   if (!context)
//     throw new Error("useBinance must be used within a BinanceProvider");
//   return context;
// };
