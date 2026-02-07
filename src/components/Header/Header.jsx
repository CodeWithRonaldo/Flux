import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>
      <Button variant="primary">Connect Wallet</Button>
    </div>
  );
};

export default Header;
