import Modal from "../Modal/Modal";
import styles from "./PurchaseModal.module.css";
import Button from "../Button/Button";
import { Zap, TrendingUp, Coins, ShieldCheck } from "lucide-react";

const PurchaseModal = ({ track, isOpen, onClose }) => {
  if (!track) return null;

  const platformFee = 0.01;
  const totalPrice = (parseFloat(track.price) + platformFee).toFixed(2);

  const benefits = [
    {
      icon: <ShieldCheck size={20} className={styles.benefitIcon} />,
      text: "Full ownership of the digital track",
    },
    {
      icon: <Zap size={20} className={styles.benefitIcon} />,
      text: "Automatic access to premium version",
    },
    {
      icon: <TrendingUp size={20} className={styles.benefitIcon} />,
      text: "Earn as the music value rises with engagement",
    },
    {
      icon: <Coins size={20} className={styles.benefitIcon} />,
      text: `Earn bonus FLX tokens for this purchase`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.purchaseContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Confirm Ownership</h2>
          <p className={styles.subtitle}>
            You are about to own <span>{track.title}</span>
          </p>
        </div>

        <div className={styles.trackSummary}>
          <img
            src={track.albumArt}
            alt={track.title}
            className={styles.albumArt}
          />
          <div className={styles.trackInfo}>
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
          </div>
        </div>

        <div className={styles.benefitsSection}>
          <h4>Ownership Benefits</h4>
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
          <div className={styles.feeRow}>
            <span>Track Price</span>
            <span>{track.price} IOTA</span>
          </div>
          <div className={styles.feeRow}>
            <span>Platform Fee</span>
            <span>{platformFee} IOTA</span>
          </div>
          <div className={`${styles.feeRow} ${styles.totalRow}`}>
            <span>Total Payable</span>
            <span>{totalPrice} IOTA</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={onClose} variant="btn-ghost">
            Cancel
          </Button>
          <Button onClick={() => alert("Purchase functionality coming soon!")}>
            Confirm & Pay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
