import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { useIota } from "../../hooks/useIota";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { formatAddress } from "../../util/helper";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";

const Header = () => {
  const { connect, isConnected, loading } = useWeb3AuthConnect();
  const { registerUser, loading: registerLoading } = useVibetraxHook();

  const { address } = useIota();
  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>
      <Button variant="primary" onClick={registerUser}>
        {registerLoading ? "Registering" : "Register"}
      </Button>
      <div>
        <Button variant="primary" onClick={connect}>
          {loading
            ? "Connecting..."
            : isConnected
              ? formatAddress(address)
              : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
