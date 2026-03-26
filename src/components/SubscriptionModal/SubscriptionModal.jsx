import Modal from "../Modal/Modal";
import styles from "../PurchaseModal/PurchaseModal.module.css";
import Button from "../Button/Button";
import { Zap, Music2, Coins, Radio, CheckCircle, Music } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useState } from "react";
import { useWeb3AuthUser } from "@web3auth/modal/react";

const SUBSCRIPTION_PRICE = "5.00";

const SubscriptionModal = ({ isOpen, onClose, subscriber, subscription }) => {
  const { userInfo } = useWeb3AuthUser();
  const { subscribe, renewSubscription, loading, error } = useVibetraxHook();
  const [done, setDone] = useState(false);

  const isRenewal = !!subscription;

  const handleSubscribe = async () => {
    const subData = {
      subscriberName: subscriber?.[0]?.username || userInfo?.name,
      subscriberRole: subscriber?.[0]?.role || "",
    };

    const result = isRenewal
      ? await renewSubscription({ ...subData, subscriptionId: subscription.id })
      : await subscribe(subData);

    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  const benefits = [
    {
      icon: <Radio size={20} className={styles.benefitIcon} />,
      text: "Unlimited music streaming",
    },
    {
      icon: <Zap size={20} className={styles.benefitIcon} />,
      text: "Earn VIBE tokens with every stream",
    },
    {
      icon: <Music2 size={20} className={styles.benefitIcon} />,
      text: "Access to full-length premium tracks",
    },
    {
      icon: <Coins size={20} className={styles.benefitIcon} />,
      text: "Up to 100 VIBE earned per day",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {!loading && !done && (
        <div className={styles.purchaseContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {isRenewal ? "Renew Subscription" : "Subscribe to VibeTrax"}
            </h2>
            <p className={styles.subtitle}>
              {isRenewal
                ? "Renew your subscription for another 30 days"
                : "Get full access to streaming and earn VIBE tokens"}
            </p>
          </div>

          <div className={styles.benefitsSection}>
            <h4>What you get</h4>
            <ul className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <li key={index} className={styles.benefitItem}>
                  {benefit.icon}
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.feesSection}>
            <div className={`${styles.feeRow} ${styles.totalRow}`}>
              <span>Total Payable</span>
              <span>{SUBSCRIPTION_PRICE} IOTA / 30 days</span>
            </div>
          </div>

          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          )}

          <div className={styles.actions}>
            <Button onClick={onClose} variant="btn-ghost">
              Cancel
            </Button>
            <Button onClick={handleSubscribe} disabled={loading}>
              {isRenewal ? "Renew Now" : "Subscribe Now"}
            </Button>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingOrb}>
            <div className={styles.orbRing} />
            <div className={styles.orbRing} />
            <div className={styles.orbRing} />
            <div className={styles.orbIcon}>
              <Music size={32} />
            </div>
          </div>
          <h2 className={styles.loadingTitle}>
            {isRenewal ? "Renewing subscription" : "Processing subscription"}
          </h2>
          <p className={styles.loadingSubtitle}>
            Confirming on IOTA blockchain
            <span className={styles.dots} />
          </p>
        </div>
      )}

      {done && (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h2 className={styles.successTitle}>You&apos;re all set!</h2>
        </div>
      )}
    </Modal>
  );
};

export default SubscriptionModal;
