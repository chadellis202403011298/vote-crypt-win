import { createConfig, http } from "wagmi";
import { APP_CHAIN, RPC_URL, WALLETCONNECT_PROJECT_ID } from "@/lib/config";
import { metaMask, walletConnect, safe } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [APP_CHAIN],
  transports: {
    [APP_CHAIN.id]: http(RPC_URL),
  },
  connectors: [
    metaMask({ dappMetadata: { name: "ElectionBet" } }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: "ElectionBet",
        description: "Encrypted election prediction markets",
        url: "https://electionbet.app",
        icons: ["https://electionbet.app/icon.png"],
      },
    }),
    safe(),
  ],
  ssr: false,
});
