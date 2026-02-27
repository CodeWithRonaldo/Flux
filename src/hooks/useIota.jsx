import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

export function useIota() {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error("useIota must be used within an IotaProvider");
  }
  return context;
}
