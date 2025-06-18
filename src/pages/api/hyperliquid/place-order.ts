import { Hyperliquid, HyperliquidConfig } from "hyperliquid";
const privateKey = process.env.HYPERLIQUID_PRIVATE_KEY as HyperliquidConfig;
const sdk = new Hyperliquid(privateKey);
export default sdk;
