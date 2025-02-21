import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

interface AuthContextType {
  address: string | null;
  isConnected: boolean;
  savedAddresses: string[];
  saveAddresses: (addresses: string[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  // Load addresses from localStorage only if the user is connected
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues
    if (isConnected && address) {
      const storedAddresses = localStorage.getItem(`addresses-${address}`);
      if (storedAddresses) {
        try {
          setSavedAddresses(JSON.parse(storedAddresses));
        } catch (error) {
          console.error("Failed to parse saved addresses:", error);
        }
      }
    }
  }, [isConnected, address]);

  // Save addresses to localStorage
  const saveAddresses = (addresses: string[]) => {
    if (!isConnected || !address) return;
    setSavedAddresses(addresses);
    localStorage.setItem(`addresses-${address}`, JSON.stringify(addresses));
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
