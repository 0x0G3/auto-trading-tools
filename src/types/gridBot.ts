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
}

export interface PriceData {
  time: string;
  price: number;
}

export interface BinanceError {
  code?: number;
  msg?: string;
}
