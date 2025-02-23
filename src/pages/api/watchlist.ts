import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

type WatchlistResponse = { tokens: string[] };
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WatchlistResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    const { wallet } = req.query as { wallet?: string };
    if (!wallet) return res.status(400).json({ error: "Wallet is required" });

    console.log("GET /api/watchlist for wallet:", wallet);
    const { data, error } = await supabase
      .from("watchlist")
      .select("tokens")
      .eq("wallet", wallet)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("GET error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ tokens: data?.tokens || [] });
  }

  if (req.method === "POST") {
    const { wallet, tokens } = req.body as {
      wallet?: string;
      tokens?: string[];
    }; // Fix: Get wallet from body
    console.log("POST /api/watchlist received:", { wallet, tokens });
    if (!wallet || !tokens) {
      return res.status(400).json({ error: "Wallet and tokens are required" });
    }

    const { error } = await supabase
      .from("watchlist")
      .upsert({ wallet, tokens });

    if (error) {
      console.error("POST error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ tokens });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
