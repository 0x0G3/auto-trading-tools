import { Chain } from "viem/chains";

export const sonic: Chain = {
  id: 146,
  name: "Sonic",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.soniclabs.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "SonicScan",
      url: "https://sonicscan.org",
    },
  },
  testnet: false,
};
