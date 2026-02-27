import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AudioProvider } from "./context/AudioProvider.jsx";
import PlayListProvider from "./context/PlayListProvider.jsx";
import { IotaClientProvider, WalletProvider } from "@iota/dapp-kit";
import { IotaProvider } from "./context/WalletProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { getFullnodeUrl } from "@iota/iota-sdk/client";
import web3AuthContextConfig from "./context/web3authContext.jsx";

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <IotaClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <IotaProvider>
              <PlayListProvider>
                <AudioProvider>
                  <RouterProvider router={router} />
                </AudioProvider>
              </PlayListProvider>
            </IotaProvider>
          </WalletProvider>
        </IotaClientProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  </StrictMode>
);
