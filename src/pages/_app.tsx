import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mantleTestnetChain: Chain = {
  id: 5001,
  nativeCurrency: {
    decimals: 18,
    name: "BIT",
    symbol: "BIT",
  },
  iconUrl: "https://www.mantle.xyz/logo-light.svg",
  network: "mantle",
  rpcUrls: {
    public: { http: ["https://rpc.testnet.mantle.xyz/"] },
    default: {
      http: ["https://rpc.testnet.mantle.xyz/"],
    },
  },
  name: "Mantle testnet",
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [mantleTestnetChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.public.http[0],
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
