import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";

const Header = ({ onConnectClick }) => {
  const handleConnectClick = () => {
    onConnectClick();
  };
  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>
      <Button variant="primary" onClick={handleConnectClick}>
        Connect Wallet
      </Button>
    </div>
  );
};

export default Header;
