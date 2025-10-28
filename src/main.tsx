import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import App from "./App.tsx";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

/**
 * Application entry point with Web3 providers
 * - WagmiProvider: Manages wallet connections and blockchain interactions
 * - RainbowKitProvider: Provides wallet connection UI (MetaMask, WalletConnect, Safe)
 * - Coinbase connector is intentionally disabled to avoid connection issues
 */
createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
  </WagmiProvider>
);
