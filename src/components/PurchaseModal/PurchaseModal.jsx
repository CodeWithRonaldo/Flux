import Modal from "../Modal/Modal";
import styles from "./PurchaseModal.module.css";
import Button from "../Button/Button";
import {
  Zap,
  TrendingUp,
  Coins,
  ShieldCheck,
  Music,
  CheckCircle,
} from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useState } from "react";
import { formatPrice } from "../../util/helper";

const PurchaseModal = ({ music, isOpen, onClose, buyer, musicFields }) => {
  const { buyMusic, loading } = useVibetraxHook();
  const [done, setDone] = useState(false);

  if (!music) return null;

  const trackPrice = parseFloat(formatPrice(music.price));
  const isOwner = musicFields?.current_owner?.fields?.user_address === buyer?.owner;
  const notForSale = musicFields ? !musicFields.for_sale : false;

  const handleBuy = async () => {
    const musicData = {
      musicId: music.music_id,
      amount: parseInt(music.price),
      buyerName: buyer?.username ?? "",
      buyerRole: buyer?.role ?? "",
    };
    const result = await buyMusic(musicData);
    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

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
            You are about to own <span>{music?.title}</span>
          </p>
        </div>

        <div className={styles.trackSummary}>
          <img
            src={music?.music_image}
            alt={music?.title}
            className={styles.albumArt}
          />
          <div className={styles.trackInfo}>
            <h3>{music?.title}</h3>
            <p>{music?.artist?.name}</p>
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
          <div className={`${styles.feeRow} ${styles.totalRow}`}>
            <span>Total Payable</span>
            <span>{trackPrice} IOTA</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={onClose} variant="btn-ghost">
            Cancel
          </Button>
          <Button onClick={handleBuy} disabled={loading || isOwner || notForSale}>
            {isOwner ? "You own this track" : notForSale ? "Not for sale" : "Confirm & Pay"}
          </Button>
        </div>
      </div>
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
          <h2 className={styles.loadingTitle}>Processing your purchase</h2>
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

export default PurchaseModal;
