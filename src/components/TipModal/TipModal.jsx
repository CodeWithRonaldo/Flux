import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./TipModal.module.css";
import { DollarSign, ListMusic } from "lucide-react";

const TipModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(0);
  const tipArtist = () => {
    console.log("artist tipped");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <DollarSign size={40} />
        </div>
        <h2 className={styles.title}>Tip Artist</h2>
        <p className={styles.subtitle}>
          Support the artist, fuel the creativity
        </p>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              className={styles.input}
              placeholder="Enter tiping amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={tipArtist} disabled={amount <= 0}>
              Tip
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TipModal;
