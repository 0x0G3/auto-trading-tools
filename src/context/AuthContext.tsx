import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAccount } from "wagmi";

interface AuthContextType {
  address: string | null;
  isConnected: boolean;
  savedAddresses: string[];
  saveAddresses: (addresses: string[]) => Promise<void>; // Made async for API calls
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address: wagmiAddress, isConnected } = useAccount();
  const address: string | null = wagmiAddress
    ? wagmiAddress.toLowerCase()
    : null;

  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  // Load addresses from Supabase when connected
  useEffect(() => {
    if (typeof window === "undefined" || !isConnected || !address) {
      setSavedAddresses([]); // Clear if disconnected
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await fetch(`/api/followers?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data: { addresses: string[] } = await res.json();
        setSavedAddresses(data.addresses || []);
      } catch (error) {
        console.error("Failed to fetch saved addresses:", error);
      }
    };

    fetchAddresses();
  }, [isConnected, address]);

  // Save addresses to Supabase
  const saveAddresses = async (addresses: string[]) => {
    if (!isConnected || !address) return;

    setSavedAddresses(addresses); // Optimistic update
    try {
      const res = await fetch("/api/followers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, addresses }),
      });
      if (!res.ok) throw new Error("Failed to save addresses");
    } catch (error) {
      console.error("Failed to save addresses:", error);
      // Optionally revert state if save fails
      setSavedAddresses(savedAddresses); // Revert to previous state
    }
  };

  return (
    <AuthContext.Provider
      value={{ address, isConnected, savedAddresses, saveAddresses }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { useAccount } from "wagmi";

// interface AuthContextType {
//   address: string | null;
//   isConnected: boolean;
//   savedAddresses: string[];
//   saveAddresses: (addresses: string[]) => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const { address: wagmiAddress, isConnected } = useAccount();
//   const address: string | null = wagmiAddress
//     ? wagmiAddress.toLowerCase()
//     : null; // ✅ Fix

//   const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

//   // Load addresses from localStorage only when the user is connected
//   useEffect(() => {
//     if (typeof window === "undefined" || !isConnected || !address) return;

//     try {
//       const storedAddresses = localStorage.getItem(`addresses-${address}`);
//       if (storedAddresses) {
//         setSavedAddresses(JSON.parse(storedAddresses));
//       }
//     } catch (error) {
//       console.error("Failed to parse saved addresses:", error);
//     }
//   }, [isConnected, address]);

//   // Save addresses to localStorage
//   const saveAddresses = (addresses: string[]) => {
//     if (!isConnected || !address) return;
//     setSavedAddresses(addresses);
//     try {
//       localStorage.setItem(`addresses-${address}`, JSON.stringify(addresses));
//     } catch (error) {
//       console.error("Failed to save addresses:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ address, isConnected, savedAddresses, saveAddresses }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
