import React, { useState, useRef, useEffect } from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { useIota } from "../../hooks/useIota";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { formatAddress } from "../../util/helper";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { Radio, Menu, X, Copy, LogOut, ChevronDown } from "lucide-react";
import useFetchUsers from "../../hooks/useFetchUsers";

const Header = () => {
  const { connect, isConnected, loading } = useWeb3AuthConnect();
  const { disconnect, loading: isDisconnecting } = useWeb3AuthDisconnect();
  const { currentUser } = useFetchUsers();
  const { address } = useIota();
  const { isSubscribed, isExpired, subscription } = useFetchSubscription();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const walletMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        walletMenuRef.current &&
        !walletMenuRef.current.contains(event.target)
      ) {
        setIsWalletMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (!address) return;
    try {
      navigator.clipboard.writeText(address);
      setIsWalletMenuOpen(false);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsWalletMenuOpen(false);
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>

      <button
        className={styles.mobileMenuToggle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X size={24} color="white" />
        ) : (
          <Menu size={24} color="white" />
        )}
      </button>

      <div
        className={`${styles.headerActions} ${isMenuOpen ? styles.mobileOpen : ""}`}
      >
        {isConnected && !isSubscribed && (
          <Button
            variant={isExpired ? undefined : "btn-ghost"}
            onClick={() => {
              setIsSubscriptionModalOpen(true);
              setIsMenuOpen(false);
            }}
            icon={<Radio size={18} />}
            className={styles.premiumBtn}
          >
            <span>{isExpired ? "Renew Subscription" : "Go Premium"}</span>
          </Button>
        )}
        {isConnected ? (
          <div className={styles.walletMenuContainer} ref={walletMenuRef}>
            <Button
              variant={"btn-primary"}
              onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span>{formatAddress(address)}</span>
                <ChevronDown size={16} />
              </div>
            </Button>

            {isWalletMenuOpen && (
              <div className={styles.walletDropdown}>
                <div className={styles.walletDropdownItem} onClick={handleCopy}>
                  <Copy size={16} /> Copy Address
                </div>
                <div
                  className={`${styles.walletDropdownItem} ${styles.disconnect}`}
                  onClick={handleDisconnect}
                >
                  <LogOut size={16} />{" "}
                  {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant={"btn-primary"}
            onClick={() => {
              connect();
              setIsMenuOpen(false);
            }}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscriber={currentUser}
        subscription={isExpired ? subscription : null}
      />
    </div>
  );
};

export default Header;
