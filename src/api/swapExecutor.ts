import { ethers } from "ethers";
import { config } from "./config";

const SMART_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
];

// Execute Uniswap V3 Swap
export const executeV3Swap = async (signer, tokenOut, amountIn) => {
  const smartRouter = new ethers.Contract(
    config.SMART_ROUTER,
    SMART_ROUTER_ABI,
    signer
  );

  const swapParams = {
    tokenIn: ethers.constants.AddressZero,
    tokenOut,
    fee: 3000, // Default to 0.3% fee tier
    recipient: await signer.getAddress(),
    amountIn: ethers.utils.parseUnits(amountIn, "ether"),
    amountOutMinimum: 0, // Slippage handling can be added later
    sqrtPriceLimitX96: 0,
  };

  const tx = await smartRouter.exactInputSingle(swapParams, {
    value: swapParams.amountIn,
  });
  await tx.wait();
  return tx.hash;
};

// Execute Uniswap V2 Swap
export const executeV2Swap = async (
  signer,
  tokenOut,
  amountIn,
  walletAddress
) => {
  const smartRouter = new ethers.Contract(
    config.SMART_ROUTER,
    SMART_ROUTER_ABI,
    signer
  );

  const path = [ethers.constants.AddressZero, tokenOut]; // ETH → Token Path
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 min expiry

  const tx = await smartRouter.swapExactETHForTokens(
    0,
    path,
    walletAddress,
    deadline,
    {
      value: ethers.utils.parseUnits(amountIn, "ether"),
    }
  );

  await tx.wait();
  return tx.hash;
};
