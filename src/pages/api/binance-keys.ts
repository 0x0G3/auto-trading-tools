import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

type BinanceKeysResponse = { api_key: string; api_secret: string };
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BinanceKeysResponse | ErrorResponse>
) {
  const { wallet } = req.query as { wallet?: string };

  if (req.method === "GET") {
    if (!wallet) return res.status(400).json({ error: "Wallet is required" });

    const { data, error } = await supabase
      .from("binance_keys")
      .select("api_key, api_secret")
      .eq("wallet", wallet)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({
      api_key: data?.api_key || "",
      api_secret: data?.api_secret || "",
    });
  }

  if (req.method === "POST") {
    const { wallet, api_key, api_secret } = req.body as {
      wallet?: string;
      api_key?: string;
      api_secret?: string;
    };
    if (!wallet || !api_key || !api_secret) {
      return res
        .status(400)
        .json({ error: "Wallet, API key, and API secret are required" });
    }

    const { error } = await supabase
      .from("binance_keys")
      .upsert({ wallet, api_key, api_secret });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ api_key, api_secret });
  }

  if (req.method === "DELETE") {
    const { wallet } = req.body as { wallet?: string };
    if (!wallet) return res.status(400).json({ error: "Wallet is required" });

    const { error } = await supabase
      .from("binance_keys")
      .delete()
      .eq("wallet", wallet);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ api_key: "", api_secret: "" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
