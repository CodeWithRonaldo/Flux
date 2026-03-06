import { Transaction } from "@iota/iota-sdk/transactions";
import { useNetworkVariables } from "../config/networkConfig";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";

const userData = {
  role: "artist",
  artistName: "oracle",
  bio: "A music composer, number one winning 2021 grammy award",
  genre: ["regae", "fuji"],
};
export const useVibetraxHook = () => {
  const [loading, setLoading] = useState(false);
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const client = useIotaClient();
  const { keypair } = useIota();

  const registerUser = async (e) => {
    e.preventDefault();
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    console.log(keypair);
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.pure.string(userData.role),
          tx.pure.string(userData.artistName),
          tx.pure.string(userData.bio),

          tx.pure.vector("string", userData.genre),
        ],
        target: `${vibeTraxPackageId}::vibetrax::register_user`,
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
