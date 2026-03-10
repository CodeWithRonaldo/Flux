import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";
import { bcs } from "@iota/iota-sdk/bcs";

export const useMusicUpload = () => {
  const [loading, setLoading] = useState(false);
  const client = useIotaClient();
  const { keypair } = useIota();
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");

  const User = bcs.struct("User", {
    name: bcs.string(),
    user_address: bcs.Address,
    role: bcs.option(bcs.string()),
    split: bcs.option(bcs.u64()),
    has_royalty: bcs.option(bcs.bool()),
  });

  const uploadMusic = async (musicData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    const collaboratorsBcs = bcs.vector(User).serialize(
      musicData.contributors.map((c) => ({
        name: c.name,
        user_address: c.user_address,
        role: c.role,
        split: c.split !== null ? BigInt(c.split) : null,
        has_royalty: c.has_royalty,
      })),
    );

    const artistUser = User.serialize({
      name: musicData.artist.name,
      user_address: musicData.artist.user_address,
      role: musicData.artist.role,
      split: musicData.artist.split,
      has_royalty: musicData.artist.has_royalty,
    });

    console.log(collaboratorsBcs.toBytes());
    console.log(artistUser.toBytes());
    console.log("Music data to submit:", musicData);
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
          tx.pure.u64(Number(musicData.price)),
          tx.pure(collaboratorsBcs),
          tx.pure(artistUser),
          tx.object("0x6"),
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
