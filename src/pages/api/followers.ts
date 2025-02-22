import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

type GetResponse = { addresses: string[] };
type PostResponse = { success: true };
type ErrorResponse = { error: string };

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    const { wallet } = req.query as { wallet?: string };
    if (!wallet) return res.status(400).json({ error: "Wallet is required" });

    const { data, error } = await supabase
      .from("followers")
      .select("addresses")
      .eq("wallet", wallet)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ addresses: data?.addresses || [] });
  }

  if (req.method === "POST") {
    const { wallet, addresses } = req.body as {
      wallet?: string;
      addresses?: string[];
    };
    if (!wallet || !addresses) {
      return res
        .status(400)
        .json({ error: "Wallet and addresses are required" });
    }

    const { error } = await supabase
      .from("followers")
      .upsert({ wallet, addresses });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
