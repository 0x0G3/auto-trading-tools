import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  // Load addresses from local storage on mount
  useEffect(() => {
    if (address) {
      const storedAddresses = localStorage.getItem(`addresses-${address}`);
      if (storedAddresses) {
        setSavedAddresses(JSON.parse(storedAddresses));
      }
    }
  }, [address]);

  // Save addresses when they change
  const saveAddresses = (addresses: string[]) => {
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

export const useAuth = () => useContext(AuthContext);
