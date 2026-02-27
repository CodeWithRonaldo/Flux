import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { useIota } from "../../hooks/useIota";
import { useWeb3AuthConnect } from "@web3auth/modal/react";

const Header = () => {
  const { connect, isConnected, connectorName, loading } = useWeb3AuthConnect();

  const { address, balance } = useIota();
  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>
      <div>
        <Button variant="primary" onClick={connect}>
          Connect Wallet
        </Button>
        {isConnected && (
          <p style={{ color: "white" }}>
            {address.slice(0, 5)}
            {balance}
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;
