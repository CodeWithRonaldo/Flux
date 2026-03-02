import { useState, useEffect } from "react";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { useWeb3Auth } from "@web3auth/modal/react";

import { useIotaClientQuery } from "@iota/dapp-kit";
import { WalletContext } from "./WalletContext";

export function IotaProvider({ children }) {
  const web3Auth = useWeb3Auth();
  const [keypair, setKeypair] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const getAddress = async () => {
      if (!web3Auth.provider) return;
      console.log("getting address");

      const privateKey = await web3Auth.provider.request({
        method: "private_key",
      });

      const privateKeyHex = privateKey.match(/.{1,2}/g);
      if (!privateKeyHex) {
        console.log("Invalid private key format");
        return;
      }

      const privateKeyUint8Array = new Uint8Array(
        privateKeyHex.map((byte) => parseInt(byte, 16))
      );

      const keyPair = Ed25519Keypair.fromSecretKey(privateKeyUint8Array);
      setKeypair(keyPair);

      const addr = keyPair.toIotaAddress();
      console.log(`Iota address: ${addr}`);
      setAddress(addr);
    };

    getAddress();
  }, [web3Auth.provider]);

  const { data, isPending } = useIotaClientQuery(
    "getBalance",
    {
      owner: address,
    },
    {
      enabled: !!address,
    }
  );

  useEffect(() => {
    if (data) {
      const balance = (+data.totalBalance / 1_000_000_000).toFixed(2);
      setBalance(balance);
    }
  }, [data]);

  return (
    <WalletContext.Provider
      value={{ keypair, address, balance, loading: isPending }}
    >
      {children}
    </WalletContext.Provider>
  );
}
