import Footer from "@/components/Footer";
import Header from "@/components/Header";
import store from "@/store";
import {
  Chain,
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import "../styles/globals.css";

const MANTLE_TESTNET_CHAIN: Chain = {
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
  [MANTLE_TESTNET_CHAIN],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.public.http[0],
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Minting Station",
  chains,
});

const WAGMI_CLIENT = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const USER_ID_KEY = "userId";
const ACCENT_COLOR = "#1e4fff";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (localStorage.getItem(USER_ID_KEY) === null) {
      const uuid = uuidv4();
      localStorage.setItem(USER_ID_KEY, uuid);
    }
  }, []);

  return (
    <Provider store={store}>
      <WagmiConfig client={WAGMI_CLIENT}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: ACCENT_COLOR,
            borderRadius: "medium",
          })}
        >
          <SnackbarProvider>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </SnackbarProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}

export default MyApp;
