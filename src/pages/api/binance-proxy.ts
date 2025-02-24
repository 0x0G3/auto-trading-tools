import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios"; // Add AxiosError import
import { HmacSHA256 } from "crypto-js";

const BASE_URL = "https://api.binance.us";

interface BinanceError {
  code?: number;
  msg?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { apiKey, apiSecret, endpoint, method, params } = req.body as {
    apiKey: string;
    apiSecret: string;
    endpoint: string;
    method: string;
    params: Record<string, string | number>;
  };

  if (!apiKey || !apiSecret || !endpoint || !method) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const stringParams = Object.fromEntries(
    Object.entries({ ...params, timestamp: Date.now() }).map(([key, value]) => [
      key,
      String(value),
    ])
  );
  const queryString = new URLSearchParams(stringParams).toString();
  const signature = HmacSHA256(queryString, apiSecret).toString();
  const url = `${BASE_URL}${endpoint}?${queryString}&signature=${signature}`;

  try {
    const response = await axios({
      method,
      url,
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError<BinanceError>;
    console.error("Proxy Error:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      url,
    });
    res.status(axiosError.response?.status || 500).json({
      error: axiosError.response?.data?.msg || axiosError.message,
    });
  }
}
