import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";

export const useVibetraxHook = () => {
  const [loading, setLoading] = useState(false);
  const client = useIotaClient();
  const { keypair } = useIota();
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");

  const registerUser = async (userData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::register_user`,
        arguments: [
          tx.pure.string(userData.role),
          tx.pure.option("string", userData.artistName),
          tx.pure.option("string", userData.bio),
          tx.pure.option("vector<string>", userData.genre),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });

      console.log("Transaction result", result);
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };
  return { registerUser, loading };
};
