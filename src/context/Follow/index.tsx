//imports needed for the file
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for the Ethereum address list context
interface FollowContextType {
  addresses: string[]; // List of Ethereum addresses
  setAddresses: Dispatch<SetStateAction<string[]>>; // Function to update the list of addresses
}

// Create the context with an initial value of undefined
const FollowContext = createContext<FollowContextType | undefined>(undefined);

// Create the provider component
export const FollowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [addresses, setAddresses] = useState<string[]>([]); // State to store the addresses

  return (
    <FollowContext.Provider value={{ addresses, setAddresses }}>
      {children}
    </FollowContext.Provider>
  );
};

// Custom hook to use the Follow context
export const useFollow = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
};
