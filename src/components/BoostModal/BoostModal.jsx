import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./BoostModal.module.css";
import { Zap, CheckCircle, Music } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import purchaseStyles from "../PurchaseModal/PurchaseModal.module.css";

const PLANS = [
  { id: 0, name: "Basic", vibe: 100, days: 7, label: "7 days" },
  { id: 1, name: "Pro", vibe: 500, days: 30, label: "30 days" },
  { id: 2, name: "Elite", vibe: 1000, days: 90, label: "90 days" },
];

const BoostModal = ({ isOpen, onClose, music }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [done, setDone] = useState(false);
  const { boostMusic, loading } = useVibetraxHook();

  const handleBoost = async () => {
    if (selectedPlan === null || !music) return;
    const result = await boostMusic({
      musicId: music.music_id,
      plan: selectedPlan,
    });
    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setSelectedPlan(null);
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setDone(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="small">
      {!loading && !done && (
        <div className={styles.container}>
          <div className={styles.iconWrapper}>
            <Zap size={40} />
          </div>
          <h2 className={styles.title}>Boost Track</h2>
          <p className={styles.subtitle}>
            Promote <span className={styles.trackName}>{music?.title}</span> — VIBE is burned permanently
          </p>

          <div className={styles.plans}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planCost}>{plan.vibe} VIBE</div>
                <div className={styles.planDuration}>{plan.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleBoost} disabled={selectedPlan === null}>
              Boost Now
            </Button>
          </div>
        </div>
      )}

      {loading && (
        <div className={purchaseStyles.loadingContainer}>
          <div className={purchaseStyles.loadingOrb}>
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbIcon}>
              <Music size={32} />
            </div>
          </div>
          <h2 className={purchaseStyles.loadingTitle}>Boosting track</h2>
          <p className={purchaseStyles.loadingSubtitle}>
            Confirming on IOTA blockchain
            <span className={purchaseStyles.dots} />
          </p>
        </div>
      )}

      {done && (
        <div className={purchaseStyles.successContainer}>
          <div className={purchaseStyles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h2 className={purchaseStyles.successTitle}>Track boosted!</h2>
        </div>
      )}
    </Modal>
  );
};

export default BoostModal;
