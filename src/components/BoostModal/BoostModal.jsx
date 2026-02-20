import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./BoostModal.module.css";
import { DollarSign } from "lucide-react";

const BoostModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(0);
  const boostTrack = () => {
    console.log("Track Boosted");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <DollarSign size={40} />
        </div>
        <h2 className={styles.title}>Boost Track</h2>
        <p className={styles.subtitle}>Boost the Track, fuel the Opportunity</p>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              className={styles.input}
              placeholder="Enter boost amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={boostTrack} disabled={amount <= 0}>
              Boost
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BoostModal;
