import { Transaction } from "@iota/iota-sdk/transactions";
import { useIotaClient } from "@iota/dapp-kit";
import { useIota } from "./useIota";
import { useState } from "react";
import { useNetworkVariables } from "../config/networkConfig";

export const useVibetraxHook = () => {
  const [loading, setLoading] = useState(false);
  const client = useIotaClient();
  const { keypair } = useIota();
  const { vibeTraxPackageId, vibeTraxTreasuryId, vibeTraxCoinManagerId } =
    useNetworkVariables("vibeTraxPackageId", "vibeTraxTreasuryId", "vibeTraxCoinManagerId");

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
  const subscribe = async (subData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
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

  const renewSubscription = async (subData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(5_000_000_000)]);
      tx.moveCall({
        target: `${vibeTraxPackageId}::vibetrax::renew_subscription`,
        arguments: [
          tx.object(subData.subscriptionId),
          coin,
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

  const tipArtist = async (tipData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      const coins = await client.getCoins({
        owner: keypair.toIotaAddress(),
        coinType: `${vibeTraxPackageId}::vibe_token::VIBE_TOKEN`,
      });

      if (!coins.data.length) {
        console.log("No VIBE tokens found");
        return null;
      }

      const tx = new Transaction();
      const amountInBase = BigInt(Math.round(tipData.amount * 1_000_000));
      const coinIds = coins.data.map((c) => c.coinObjectId);
      const primaryCoin = tx.object(coinIds[0]);

      if (coinIds.length > 1) {
        tx.mergeCoins(primaryCoin, coinIds.slice(1).map((id) => tx.object(id)));
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

  const BOOST_PLAN_AMOUNTS = [100_000_000n, 500_000_000n, 1_000_000_000n];

  const boostMusic = async (boostData) => {
    if (!keypair) {
      console.log("Wallet not connected");
      return;
    }
    try {
      setLoading(true);
      const coins = await client.getCoins({
        owner: keypair.toIotaAddress(),
        coinType: `${vibeTraxPackageId}::vibe_token::VIBE_TOKEN`,
      });

      if (!coins.data.length) {
        console.log("No VIBE tokens found");
        return null;
      }

      const tx = new Transaction();
      const requiredAmount = BOOST_PLAN_AMOUNTS[boostData.plan];
      const coinIds = coins.data.map((c) => c.coinObjectId);
      const primaryCoin = tx.object(coinIds[0]);

      if (coinIds.length > 1) {
        tx.mergeCoins(primaryCoin, coinIds.slice(1).map((id) => tx.object(id)));
      }

      const [boostCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(requiredAmount)]);

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

  return { registerUser, buyMusic, subscribe, renewSubscription, tipArtist, boostMusic, loading };

};
