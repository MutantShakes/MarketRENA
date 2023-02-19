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
import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

const client = createReactClient({
  provider: studioProvider({ apiKey: "ac31c2f7-c877-419c-a7f5-85c0d9fc566b" }), // Livepeer API
});

const { chains, provider } = configureChains(
  [goerli, mainnet, polygon, optimism, arbitrum],
  [infuraProvider({ apiKey: "6daee45f958b4a4ba25dd391d48358ed" })] //infura API
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
        <LivepeerConfig client={client}>
          <Component {...pageProps} />
        </LivepeerConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
