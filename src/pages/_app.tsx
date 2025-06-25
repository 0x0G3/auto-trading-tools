import Footer from "../components/UI/Footer";
import Navbar from "../components/UI/Navbar";
import "../styles/globals.css";
import type { AppProps } from "next/app";
// import Navbar from "../components/UI/Navbar";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { WagmiProvider } from "wagmi";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { config } from "../wagmi";
// import { AuthProvider } from "../context/AuthContext"; // ✅ Import Auth Context
// import { WatchlistProvider } from "../context/WatchlistContext";
// import { BinanceProvider } from "../context/BinanceContext";

// const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <AuthProvider>
              <WatchlistProvider>
                <BinanceProvider> */}
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      {/* </BinanceProvider>
      //         </WatchlistProvider>
      //       </AuthProvider>
      //     </RainbowKitProvider>
      //   </QueryClientProvider>
      // </WagmiProvider> */}
    </>
  );
}

export default MyApp;
