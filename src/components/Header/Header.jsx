import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>FLUX</h1>
        <Button
          className={styles.connectBtn}
          text="Connect Wallet"
          btnClass="primary"
        />
      </div>
    </div>
  );
};

export default Header;
