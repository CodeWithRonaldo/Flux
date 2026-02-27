import { createContext } from "react";

export const WalletContext = createContext({
  keypair: null,
  address: "",
  balance: "",
  loading: false,
});
