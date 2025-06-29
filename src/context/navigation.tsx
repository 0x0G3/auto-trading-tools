import { createContext, useContext } from "react";
import { useRouter } from "next/router";

// Define the shape of the navigation context
interface NavigationContextType {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  // Add more navigation methods or properties as needed
}

// Create the context with a default undefined value
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Navigation Provider component
export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Provide router methods
  const value: NavigationContextType = {
    push: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
    back: () => router.back(),
    // Add more methods here in the future
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook to access the navigation context
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
