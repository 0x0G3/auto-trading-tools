import type { NextApiRequest, NextApiResponse } from "next";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol?: string;
  tokenName?: string;
  contractAddress?: string;
}

interface BasescanResponse {
  status: string;
  message: string;
  result: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    timeStamp: string;
    tokenSymbol?: string;
    tokenName?: string;
    contractAddress?: string;
  }>;
}

const BASESCAN_API_URL = "https://api.basescan.org/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { wallet } = req.query as { wallet?: string };
  if (!wallet)
    return res.status(400).json({ error: "Wallet address required" });

  const apiKey = process.env.BASESCAN_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "Basescan API key missing" });

  try {
    const txResponse = await fetch(
      `${BASESCAN_API_URL}?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    const txData: BasescanResponse = await txResponse.json();
    if (txData.status !== "1")
      throw new Error("Failed to fetch transactions: " + txData.message);

    const tokenResponse = await fetch(
      `${BASESCAN_API_URL}?module=account&action=tokentx&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    const tokenData: BasescanResponse = await tokenResponse.json();
    if (tokenData.status !== "1")
      throw new Error("Failed to fetch token transfers: " + tokenData.message);

    const transactions: Transaction[] = [
      ...txData.result.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timeStamp: tx.timeStamp,
      })),
      ...tokenData.result.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timeStamp: tx.timeStamp,
        tokenSymbol: tx.tokenSymbol,
        tokenName: tx.tokenName,
        contractAddress: tx.contractAddress,
      })),
    ].reduce((unique: Transaction[], tx: Transaction) => {
      return unique.find((t) => t.hash === tx.hash) ? unique : [...unique, tx];
    }, []);

    res.status(200).json(transactions.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
