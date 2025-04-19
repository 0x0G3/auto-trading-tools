export interface PremiumBotProps {
  apiKey: string | null;
  apiSecret: string | null;
  log: (message: string) => void;
  updatePriceHistory: (price: number) => void;
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface Order {
  orderId: number;
  price: number;
  quantity: number;
  symbol: string;
  type?: "buy" | "sell"; // Optional for SMC/ICT to track order side
}

export interface PriceData {
  time: string;
  price: number;
}

export interface BinanceError {
  code?: number;
  msg?: string;
}

export interface PremiumBotState {
  wallet: string;
  symbol: string;
  is_running: boolean;
  investment: number;
  interval_ms: number;
  strategy: string;
  strategy_data: {
    config: {
      lookbackPeriod?: number;
      interval?: string;
      [key: string]: any;
    };
    state: {
      activeOrders?: Order[];
      orderBlocks?: { type: string; price: number; orderPlaced: boolean }[];
      [key: string]: any;
    };
  };
}

export interface PremiumBotLog {
  message: string;
  timestamp: string;
}

export interface PremiumStatusResponse {
  state: PremiumBotState | null;
  logs: PremiumBotLog[];
}
