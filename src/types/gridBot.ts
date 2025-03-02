// types/gridBot.ts
export interface GridBotProps {
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
  symbol: string; // Tracks the trading pair for each order
}

export interface PriceData {
  time: string;
  price: number;
}

export interface BinanceError {
  code?: number;
  msg?: string;
}

// Define the shape of a single bot state
export interface BotState {
  wallet: string;
  symbol: string;
  is_running: boolean;
  investment: number;
  percentage_drop: number;
  percentage_rise: number;
  interval_ms: number;
}

// Define a single log entry
export interface BotLog {
  message: string;
  timestamp: string; // Assuming Supabase adds this
}

// Define an active order response for a specific symbol
export interface ActiveOrderResponse {
  symbol: string;
  orders: Order[];
}

// Define the full /status response from the backend
export interface StatusResponse {
  states: BotState[];
  logs: BotLog[];
  activeOrders: ActiveOrderResponse[];
}
