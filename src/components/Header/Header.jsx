import React, { useState } from "react";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { useIota } from "../../hooks/useIota";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { formatAddress } from "../../util/helper";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { Radio } from "lucide-react";

const Header = ({ currentUser }) => {
  const { connect, isConnected, loading } = useWeb3AuthConnect();
  const { address } = useIota();
  const { isSubscribed, isExpired, subscription } = useFetchSubscription();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>FLUX</h1>

      <div className={styles.headerActions}>
        {isConnected && !isSubscribed && (
          <Button
            variant={isExpired ? undefined : "btn-ghost"}
            onClick={() => setIsSubscriptionModalOpen(true)}
            icon={<Radio size={18} />}
          >
            {isExpired ? "Renew Subscription" : "Go Premium"}
          </Button>
        )}
        <Button variant="primary" onClick={connect}>
          {loading
            ? "Connecting..."
            : isConnected
              ? formatAddress(address)
              : "Connect Wallet"}
        </Button>
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
