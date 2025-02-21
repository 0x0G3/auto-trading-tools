import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { getPoolOrPair } from "@/src/api/swapHelper"; // Determines if V2 or V3
import { executeV2Swap, executeV3Swap } from "@/src/api/swapExecutor"; // Swap functions
import { config } from "@/src/api/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { tokenOut, amountIn, walletAddress } = req.body;
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);

    // Check if there's a V2 or V3 pool for the token
    const poolData = await getPoolOrPair(
      ethers.constants.AddressZero,
      tokenOut
    );

    let txHash;
    if (poolData.type === "V3") {
      txHash = await executeV3Swap(signer, tokenOut, amountIn);
    } else if (poolData.type === "V2") {
      txHash = await executeV2Swap(signer, tokenOut, amountIn, walletAddress);
    } else {
      throw new Error("No available liquidity pool found.");
    }

    res.status(200).json({ success: true, txHash });
  } catch (error) {
    console.error("Swap Error:", error);
    res.status(500).json({ error: error.message });
  }
}
