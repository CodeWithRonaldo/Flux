import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";

export const useMusicUpload = () => {
  const [loading, setLoading] = useState(false);
  const client = useIotaClient();
  const { keypair, address } = useIota();
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");

  const uploadMusic = async (musicData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::upload_music`,
        arguments: [
          tx.pure.string(musicData.title),
          tx.pure.string(musicData.description),
          tx.pure.string(musicData.genre),
          tx.pure.string(musicData.imageFile),
          tx.pure.string(musicData.lowQualityFile),
          tx.pure.string(musicData.highQualityFile),
          tx.pure.u64(musicData.price),
          tx.pure.vector(musicData.contributors),
          tx.pure.obj(address),
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
  return { uploadMusic, loading };
};
