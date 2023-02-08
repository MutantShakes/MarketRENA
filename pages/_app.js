import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

import { infuraProvider } from "wagmi/providers/infura";

import "../styles/globals.css";

const { chains, provider } = configureChains(
  [goerli, mainnet, polygon, optimism, arbitrum],
  [infuraProvider({ apiKey: "6daee45f958b4a4ba25dd391d48358ed" })]
);

const { connectors } = getDefaultWallets({
  appName: "MarketRENA",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains} theme={midnightTheme()}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;