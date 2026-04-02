import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";
import { getContractError } from "../util/helper";
import useFetchUsers from "./useFetchUsers";

export const useMusicUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const client = useIotaClient();
  const { keypair } = useIota();
  const { currentUser } = useFetchUsers();
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");

  const uploadMusic = async (musicData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return null;
    }

    try {
      setLoading(true);
      setError("");

      const profileId = currentUser?.profile_id;
      if (!profileId) {
        setError(
          "User profile not found. Please wait a moment or register first.",
        );
        return null;
      }

      // The Move contract uses std::ascii::String which rejects emojis and smart quotes.
      // We must strip any non-ASCII characters or it will fail dry run deserialization.
      // eslint-disable-next-line no-control-regex
      const toAscii = (str) => (str || "").replace(/[^\x00-\x7F]/g, "").trim();

      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::upload_music`,
        arguments: [
          tx.object(profileId),
          tx.pure.string(toAscii(musicData.title)),
          tx.pure.string(toAscii(musicData.description)),
          tx.pure.string(toAscii(musicData.genre)),
          tx.pure.string(toAscii(musicData.imageFile)),
          tx.pure.string(toAscii(musicData.lowQualityFile)),
          tx.pure.string(toAscii(musicData.highQualityFile)),
          tx.pure.u64(Number(musicData.price)),
          tx.pure.string(toAscii(musicData.artist.name || "Artist")),
          tx.pure.string(toAscii(musicData.artist.role || "Creator")),
          tx.pure.string(toAscii(musicData.artist.imageUrl || "")),
          tx.pure.u64(musicData.artist.artistPercentage),
          tx.pure.bool(musicData.artist.artistHasRoyalty),
          tx.pure.vector(
            "string",
            (musicData.collaboratorNames || []).map(toAscii),
          ),
          tx.pure.vector("address", musicData.collaboratorAddresses || []),
          tx.pure.vector(
            "string",
            (musicData.collaboratorRoles || []).map(toAscii),
          ),
          tx.pure.vector(
            "string",
            (musicData.collaboratorImageUrls || []).map(toAscii),
          ),
          tx.pure.vector("u64", musicData.collaboratorPercentage || []),
          tx.pure.vector("bool", musicData.collaboratorHasRoyalty || []),
          tx.object("0x6"),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Upload failed. Please try again.");
        return null;
      }

      return result;
    } catch (e) {
      const contractError = getContractError(e);
      setError(
        contractError !== "Transaction failed. Please try again."
          ? contractError
          : e.message,
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadMusic, loading, error };
};
