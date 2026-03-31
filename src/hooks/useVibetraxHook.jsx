import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";
import { getContractError } from "../util/helper";

export const useVibetraxHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const client = useIotaClient();
  const { keypair, balance, balanceLoading, vibeTokenBalance } = useIota();
  const { vibeTraxPackageId, vibeTraxTreasuryId, vibeTraxCoinManagerId } =
    useNetworkVariables(
      "vibeTraxPackageId",
      "vibeTraxTreasuryId",
      "vibeTraxCoinManagerId",
    );

  const registerUser = async (userData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::register_user`,
        arguments: [
          tx.pure.string(userData.role),
          tx.pure.option("string", userData.artistName),
          tx.pure.option("string", userData.bio),
          tx.pure.option("vector<string>", userData.genre),
          tx.pure.option("string", userData.imageUrl ?? null),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Registration failed. Please try again.");
        return null;
      }

      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buyMusic = async (musicData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= musicData.amount) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
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

      if (result.effects?.status?.status !== "success") {
        setError("Purchase failed. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (subData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (balance && balance <= 5) {
          setError(
            "Insufficient balance. You need at least 5 IOTA to subscribe.",
          );
          return;
        }
      }
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(5_000_000_000)]);
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::subscribe`,
        arguments: [
          tx.pure.string(subData.subscriberName),
          tx.pure.string(subData.subscriberRole),
          coin,
          tx.object("0x6"),
        ],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Subscription failed. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renewSubscription = async (subData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (balance && balance <= 5) {
          setError(
            "Insufficient balance. You need at least 5 IOTA to renew your subscription.",
          );
          return;
        }
      }
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(5_000_000_000)]);
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::renew_subscription`,
        arguments: [tx.object(subData.subscriptionId), coin, tx.object("0x6")],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Subscription renewal failed. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const tipArtist = async (tipData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const coins = await client.getCoins({
        owner: keypair.toIotaAddress(),
        coinType: `${vibeTraxPackageId}::vibe_token::VIBE_TOKEN`,
      });

      if (!coins.data.length) {
        setError("No VIBE tokens found");
        return null;
      }

      const tx = new Transaction();
      const amountInBase = BigInt(Math.round(tipData.amount * 1_000_000));
      const coinIds = coins.data.map((c) => c.coinObjectId);
      const primaryCoin = tx.object(coinIds[0]);

      if (coinIds.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          coinIds.slice(1).map((id) => tx.object(id)),
        );
      }

      const [tipCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(amountInBase)]);

      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::tip_artist`,
        arguments: [tx.object(tipData.musicId), tipCoin],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to tip artist. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const BOOST_PLAN_AMOUNTS = [100_000_000n, 500_000_000n, 1_000_000_000n];

  const boostMusic = async (boostData) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const coins = await client.getCoins({
        owner: keypair.toIotaAddress(),
        coinType: `${vibeTraxPackageId}::vibe_token::VIBE_TOKEN`,
      });

      if (!coins.data.length) {
        setError("No VIBE tokens found");
        return null;
      }

      const tx = new Transaction();
      const requiredAmount = BOOST_PLAN_AMOUNTS[boostData.plan];
      const coinIds = coins.data.map((c) => c.coinObjectId);
      const primaryCoin = tx.object(coinIds[0]);

      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }

        if (
          vibeTokenBalance &&
          vibeTokenBalance < Number(requiredAmount / 1_000_000n)
        ) {
          setError("Insufficient VIBE balance");
          return;
        }
      }

      if (coinIds.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          coinIds.slice(1).map((id) => tx.object(id)),
        );
      }

      const [boostCoin] = tx.splitCoins(primaryCoin, [
        tx.pure.u64(requiredAmount),
      ]);

      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::boost_music`,
        arguments: [
          tx.object(boostData.musicId),
          tx.object(vibeTraxTreasuryId),
          tx.object(vibeTraxCoinManagerId),
          boostCoin,
          tx.pure.u8(boostData.plan),
          tx.object("0x6"),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to boost music. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const streamMusic = async (streamData) => {
    if (!keypair) return null;
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::stream_music`,
        arguments: [
          tx.object(streamData.musicId),
          tx.object(streamData.subscriptionId),
          tx.pure.string(streamData.streamerName),
          tx.pure.string(streamData.streamerRole),
          tx.object("0x6"),
        ],
      });
      const result = await client.signAndExecuteTransaction(
        {
          transaction: tx,
          signer: keypair,
          options: { showEffects: true },
        },
        {},
      );
      if (result.effects?.status?.status !== "success") {
        console.log("Stream failed:", result.effects?.status);
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      console.log("Error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async (subscriptionId) => {
    if (!keypair) {
      setError("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::claim_rewards`,
        arguments: [tx.object(subscriptionId), tx.object(vibeTraxTreasuryId)],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });
      if (result.effects?.status?.status !== "success") {
        setError("Unable to claim rewards. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const likeMusic = async (likeData) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::like_music`,
        arguments: [
          tx.object(likeData.musicId),
          tx.pure.string(likeData.likerName),
          tx.pure.string(likeData.likerRole),
        ],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to like music. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMusic = async (updateData) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::update_music`,
        arguments: [
          tx.object(updateData.musicId),
          tx.pure.option("string", updateData.title ?? null),
          tx.pure.option("string", updateData.description ?? null),
          tx.pure.option("string", updateData.genre ?? null),
          tx.pure.option("string", updateData.musicImage ?? null),
          tx.pure.option("string", updateData.previewMusic ?? null),
          tx.pure.option("string", updateData.fullMusic ?? null),
        ],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });
      if (result.effects?.status?.status !== "success") {
        console.log("Update failed:", result.effects?.status);
        setError("Unable to update music. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleSale = async (musicId) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::toggle_sale`,
        arguments: [tx.object(musicId)],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });
      if (result.effects?.status?.status !== "success") {
        setError("Unable to toggle sale. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMusic = async (musicId) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance <= 0) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::delete_music`,
        arguments: [tx.object(musicId)],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to delete music. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const withdrawIota = async (amount, recipient) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (!balanceLoading) {
        if (!balance || balance < amount) {
          setError("Insufficient balance to complete this transaction.");
          return;
        }
      }
      const tx = new Transaction();
      const [withdrawCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::withdrawIotaBalance`,
        arguments: [
          withdrawCoin,
          tx.pure.u64(amount),
          tx.pure.address(recipient),
        ],
      });
      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to withdraw IOTA. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const withdrawVibe = async (amount, recipient) => {
    if (!keypair) {
      setError("Wallet not connected.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const coins = await client.getCoins({
        owner: keypair.toIotaAddress(),
        coinType: `${vibeTraxPackageId}::vibe_token::VIBE_TOKEN`,
      });

      if (!coins.data.length) {
        setError("No VIBE tokens found");
        return null;
      }

      if (vibeTokenBalance && vibeTokenBalance < Number(amount / 1_000_000n)) {
        setError("Insufficient VIBE balance");
        return null;
      }

      const tx = new Transaction();
      const coinIds = coins.data.map((c) => c.coinObjectId);
      const primaryCoin = tx.object(coinIds[0]);

      if (coinIds.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          coinIds.slice(1).map((id) => tx.object(id)),
        );
      }

      const [withdrawCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(amount)]);

      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::withdrawVibeBalance`,
        arguments: [
          withdrawCoin,
          tx.pure.u64(amount),
          tx.pure.address(recipient),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true },
      });

      if (result.effects?.status?.status !== "success") {
        setError("Unable to withdraw VIBE. Please try again.");
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = getContractError(e);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    buyMusic,
    subscribe,
    renewSubscription,
    tipArtist,
    boostMusic,
    streamMusic,
    claimRewards,
    likeMusic,
    updateMusic,
    toggleSale,
    deleteMusic,
    withdrawIota,
    withdrawVibe,
    loading,
    error,
  };
};
