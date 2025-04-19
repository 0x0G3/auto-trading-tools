import axios, { AxiosError } from "axios";

interface BinanceError {
  code?: number;
  msg?: string;
}

interface TradingPairInfo {
  minQty: number;
  maxQty: number;
  stepSize: number;
  tickSize: number;
  minPrice: number;
  maxPrice: number;
  minNotional: number;
}

interface Order {
  orderId: number;
  price: number;
  quantity: number;
}

export async function makeRequest(
  endpoint: string,
  method: string,
  apiKey: string,
  apiSecret: string,
  params: Record<string, string | number> = {}
): Promise<any> {
  try {
    const response = await axios.post("/api/binance-proxy", {
      apiKey,
      apiSecret,
      endpoint,
      method,
      params,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    console.error("Proxy API Error:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw new Error(axiosError.response?.data?.msg || axiosError.message);
  }
}

export async function getCurrentPrice(symbol: string): Promise<number> {
  const url = "https://api.binance.us/api/v3/ticker/price";
  try {
    const response = await axios.get(url, { params: { symbol } });
    const price = parseFloat(response.data.price);
    console.log(
      `[${new Date().toISOString()}] Current price of ${symbol}: $${price}`
    );
    return price;
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    console.error(
      "Error fetching price:",
      axiosError.response?.data?.msg || axiosError.message
    );
    throw new Error(axiosError.response?.data?.msg || axiosError.message);
  }
}

export async function getTradingPairInfo(
  symbol: string
): Promise<TradingPairInfo> {
  const url = "https://api.binance.us/api/v3/exchangeInfo";
  try {
    const response = await axios.get(url);
    const pair = response.data.symbols.find((s: any) => s.symbol === symbol);
    if (!pair) throw new Error(`Trading pair ${symbol} not found`);

    const lotSize = pair.filters.find((f: any) => f.filterType === "LOT_SIZE");
    const priceFilter = pair.filters.find(
      (f: any) => f.filterType === "PRICE_FILTER"
    );
    const minNotional = pair.filters.find(
      (f: any) => f.filterType === "MIN_NOTIONAL"
    );

    console.log(
      `[${new Date().toISOString()}] Fetched trading pair info for ${symbol}`
    );

    return {
      minQty: parseFloat(lotSize.minQty),
      maxQty: parseFloat(lotSize.maxQty),
      stepSize: parseFloat(lotSize.stepSize),
      tickSize: parseFloat(priceFilter.tickSize),
      minPrice: parseFloat(priceFilter.minPrice),
      maxPrice: parseFloat(priceFilter.maxPrice),
      minNotional: parseFloat(minNotional.minNotional),
    };
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    console.error("Error fetching trading pair info:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw new Error(axiosError.response?.data?.msg || axiosError.message);
  }
}

export function adjustQuantity(
  quantity: number,
  stepSize: number,
  minQty: number
): number {
  let adjustedQuantity = Math.floor(quantity / stepSize) * stepSize;
  if (adjustedQuantity < minQty) adjustedQuantity = minQty;
  return adjustedQuantity;
}

export function adjustPrice(
  price: number,
  tickSize: number,
  minPrice: number
): number {
  let adjustedPrice = Math.floor(price / tickSize) * tickSize;
  if (adjustedPrice < minPrice) adjustedPrice = minPrice;
  return adjustedPrice;
}

export function isValidNotional(
  quantity: number,
  price: number,
  minNotional: number
): boolean {
  return quantity * price >= minNotional;
}

export async function fetchActiveOrders(
  symbol: string,
  apiKey: string,
  apiSecret: string
): Promise<Order[]> {
  const params = {
    symbol,
    recvWindow: 5000,
  };
  const data = await makeRequest(
    "/api/v3/openOrders",
    "GET",
    apiKey,
    apiSecret,
    params
  );
  return data.map((order: any) => ({
    orderId: order.orderId,
    price: parseFloat(order.price),
    quantity: parseFloat(order.origQty),
  }));
}

export async function placeSpotOrder(
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number,
  price: number,
  apiKey: string,
  apiSecret: string
): Promise<{ orderId: number; quantity: number; price: number }> {
  const params = {
    symbol,
    side,
    type: "LIMIT",
    timeInForce: "GTC",
    quantity: quantity.toFixed(6),
    price: price.toFixed(4),
    recvWindow: 5000,
  };
  const result = await makeRequest(
    "/api/v3/order",
    "POST",
    apiKey,
    apiSecret,
    params
  );
  return { orderId: result.orderId, quantity, price };
}

export async function checkOrderStatus(
  symbol: string,
  orderId: number,
  apiKey: string,
  apiSecret: string
): Promise<any> {
  const params = {
    symbol,
    orderId,
    recvWindow: 5000,
  };
  return await makeRequest("/api/v3/order", "GET", apiKey, apiSecret, params);
}
