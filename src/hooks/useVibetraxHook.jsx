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
        options: { showEffects: true },
      });

      console.log("Transaction result", result);

      if (result.effects?.status?.status !== "success") {
        console.log("Transaction failed:", result.effects?.status);
        return null;
      }

      return result;
    } catch (e) {
      console.log("Error:", e);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const buyMusic = async (musicData) => {
    if (!keypair){
      console.log("Wallet not connected");
      return;
    }
    try{
      setLoading(true);
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(musicData.amount)]);
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::purchase_music_nft`,
        arguments: [
          tx.object(musicData.musicId),
          coin,
          tx.pure.string(musicData.buyerName),
          tx.pure.string(musicData.buyerRole),
        ],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      console.log("Transaction result", result);
      if (result.effects?.status?.status !== "success") {
        console.log("Transaction failed:", result.effects?.status);
        return null;
      }
      return result;

    } catch (e){
      console.log("Error:", e);
      return null;
    } finally {
      setLoading(false);
    }

    
  };
  return { registerUser, buyMusic, loading };

};
