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

export async function fetchWalletActivity(
  wallet: string
): Promise<Transaction[]> {
  console.log("Fetching activity for wallet:", wallet);
  console.log(
    "NEXT_PUBLIC_BASESCAN_API_KEY:",
    process.env.NEXT_PUBLIC_BASESCAN_API_KEY
  );
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  if (!apiKey) throw new Error("Basescan API key missing");

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

  return transactions.slice(0, 10);
}
