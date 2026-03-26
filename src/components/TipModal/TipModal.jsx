import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./TipModal.module.css";
import { Coins, CheckCircle } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import purchaseStyles from "../PurchaseModal/PurchaseModal.module.css";
import TransactionLoader from "../TransactionLoader/TransactionLoader";

const QUICK_AMOUNTS = [5, 10, 25, 50];

const TipModal = ({ isOpen, onClose, music }) => {
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const { tipArtist, loading,error } = useVibetraxHook();

  const handleTip = async () => {
    if (!amount || Number(amount) <= 0 || !music) return;
    const result = await tipArtist({
      musicId: music.music_id,
      amount: Number(amount),
    });
    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount("");
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setAmount("");
    setDone(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="small">
      {!loading && !done && (
        <div className={styles.container}>
          <div className={styles.iconWrapper}>
            <Coins size={40} />
          </div>
          <h2 className={styles.title}>Tip Artist</h2>
          <p className={styles.subtitle}>
            Support{" "}
            <span className={styles.artistName}>{music?.artist?.name}</span>{" "}
            with VIBE tokens
          </p>

          <div className={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((preset) => (
              <button
                key={preset}
                className={`${styles.quickBtn} ${Number(amount) === preset ? styles.quickBtnActive : ""}`}
                onClick={() => setAmount(String(preset))}
              >
                {preset} VIBE
              </button>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="number"
              className={styles.input}
              placeholder="Custom amount in VIBE"
              value={amount}
              min="1"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && (
            <div className={purchaseStyles.errorContainer}>
              <p className={purchaseStyles.errorMessage}>{error}</p>
            </div>
          )}

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleTip}
              disabled={!amount || Number(amount) <= 0}
            >
              Send Tip
            </Button>
          </div>
        </div>
      )}

      {loading && <TransactionLoader title="Sending tip" />}

      {done && (
        <div className={purchaseStyles.successContainer}>
          <div className={purchaseStyles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h2 className={purchaseStyles.successTitle}>Tip sent!</h2>
        </div>
      )}

    </Modal>
  );
};

export default TipModal;
