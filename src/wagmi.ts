import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sonic } from "./chains"; // Adjust the import path as necessary
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

export const config = getDefaultConfig({
  appName: "sonic assist",
  projectId: "YOUR_PROJECT_ID",
  chains: [sonic, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});
