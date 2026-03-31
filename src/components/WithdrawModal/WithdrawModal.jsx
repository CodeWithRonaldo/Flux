import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./WithdrawModal.module.css";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import purchaseStyles from "../PurchaseModal/PurchaseModal.module.css";
import TransactionLoader from "../TransactionLoader/TransactionLoader";

const WithdrawModal = ({ isOpen, onClose }) => {
  const [tokenType, setTokenType] = useState("IOTA");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [done, setDone] = useState(false);
  const { withdrawIota, withdrawVibe, loading, error } = useVibetraxHook();

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0 || !recipient) return;

    // IOTA amounts in the contract use 9 decimals, VIBE use 6 decimals.
    // Assuming user enters standard value here, we convert:
    const amountInBase =
      tokenType === "IOTA"
        ? BigInt(Math.round(Number(amount) * 1_000_000_000))
        : BigInt(Math.round(Number(amount) * 1_000_000));

    let result;
    if (tokenType === "IOTA") {
      result = await withdrawIota(amountInBase, recipient);
    } else {
      result = await withdrawVibe(amountInBase, recipient);
    }

    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount("");
      setRecipient("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setAmount("");
    setRecipient("");
    setDone(false);
    onClose();
  };

  const numAmount = Number(amount) || 0;
  const platformFee = numAmount * 0.01;
  const finalAmount = numAmount - platformFee;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="small">
      {!loading && !done && (
        <div className={styles.container}>
          <div className={styles.iconWrapper}>
            <ArrowUpRight size={40} />
          </div>
          <h2 className={styles.title}>Withdraw Funds</h2>
          <p className={styles.subtitle}>
            Transfer your tokens to another wallet address.
          </p>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Select Token</label>
              <div className={styles.tokenSelector}>
                <button
                  className={`${styles.tokenBtn} ${tokenType === "IOTA" ? styles.tokenBtnActive : ""}`}
                  onClick={() => setTokenType("IOTA")}
                >
                  IOTA
                </button>
                <button
                  className={`${styles.tokenBtn} ${tokenType === "VIBE" ? styles.tokenBtnActive : ""}`}
                  onClick={() => setTokenType("VIBE")}
                >
                  VIBE
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Recipient Address</label>
              <input
                type="text"
                className={styles.input}
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Amount to Withdraw</label>
              <input
                type="number"
                className={styles.input}
                placeholder={`0.00 ${tokenType}`}
                value={amount}
                min="0"
                step="0.01"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {numAmount > 0 && (
              <div className={styles.feePreview}>
                <div className={styles.feeRow}>
                  <span>Withdrawal Amount:</span>
                  <span>
                    {numAmount.toFixed(4)} {tokenType}
                  </span>
                </div>
                <div className={styles.feeRow}>
                  <span>Platform Fee (1%):</span>
                  <span>
                    -{platformFee.toFixed(4)} {tokenType}
                  </span>
                </div>
                <div className={`${styles.feeRow} ${styles.final}`}>
                  <span>Recipient Gets:</span>
                  <span>
                    {finalAmount.toFixed(4)} {tokenType}
                  </span>
                </div>
              </div>
            )}
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
              onClick={handleWithdraw}
              disabled={!amount || Number(amount) <= 0 || !recipient}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

      {loading && <TransactionLoader title="Processing Withdrawal" />}

      {done && (
        <div className={purchaseStyles.successContainer}>
          <div className={purchaseStyles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h2 className={purchaseStyles.successTitle}>Withdrawal sent!</h2>
        </div>
      )}
    </Modal>
  );
};

export default WithdrawModal;
