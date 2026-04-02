import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Zap, CheckCircle } from "lucide-react";
import styles from "./Boost.module.css";
import Button from "../../components/Button/Button";
import TransactionLoader from "../../components/TransactionLoader/TransactionLoader";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useFetchMusicById } from "../../hooks/useFetchMusicById";

const PLANS = [
  { id: 0, name: "Basic", vibe: 100, days: 7, label: "7 days" },
  { id: 1, name: "Pro", vibe: 500, days: 30, label: "30 days" },
  { id: 2, name: "Elite", vibe: 1000, days: 90, label: "90 days" },
];

const Boost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { music } = useFetchMusicById(id);
  const { boostMusic, loading, error } = useVibetraxHook();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [done, setDone] = useState(false);

  const handleBoost = async () => {
    if (selectedPlan === null || !music) return;
    const result = await boostMusic({ musicId: music.music_id, plan: selectedPlan });
    if (!result?.digest) return;
    setDone(true);
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <TransactionLoader title="Boosting track" />
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.centered}>
        <div className={styles.successIcon}>
          <CheckCircle size={56} />
        </div>
        <h2 className={styles.successTitle}>Track boosted!</h2>
        <Button onClick={() => navigate(`/play/${id}`)}>Done</Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Zap size={36} />
        </div>

        <h1 className={styles.title}>Boost Track</h1>

        <div className={styles.trackInfo}>
          <img
            src={music?.music_image}
            alt={music?.title}
            className={styles.trackImage}
          />
          <div>
            <p className={styles.trackTitle}>{music?.title}</p>
            <p className={styles.trackArtist}>{music?.artist?.name}</p>
          </div>
        </div>

        <p className={styles.subtitle}>
          VIBE is burned permanently to promote your track
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

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button variant="btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleBoost} disabled={selectedPlan === null}>
            Boost Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Boost;
