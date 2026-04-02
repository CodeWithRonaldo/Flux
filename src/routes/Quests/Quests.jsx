import React, { useState } from "react";
import styles from "./Quests.module.css";
import Button from "../../components/Button/Button";
import { Music2, Radio, Zap, Heart, Coins, Gift, CheckCircle, Star } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import useFetchUsers from "../../hooks/useFetchUsers";
import TransactionLoader from "../../components/TransactionLoader/TransactionLoader";
import { useWeb3AuthConnect } from "@web3auth/modal/react";

const Quests = () => {
  const { userProfile, currentUser } = useFetchUsers();
  const { claimKpiBounty, loading, error } = useVibetraxHook();
  const { isConnected } = useWeb3AuthConnect();
  const [success, setSuccess] = useState(false);

  if (!isConnected || !userProfile) {
    return (
      <div className={styles.container}>
        <div className={styles.authPrompt}>
          <h2>Connect & Register</h2>
          <p>Please connect your wallet and register an account to view and participate in Quests.</p>
        </div>
      </div>
    );
  }

  const isArtist = currentUser?.role?.toLowerCase() === "artist";

  const standardKpis = isArtist
    ? [
        { label: "Upload Tracks", description: "Publish at least 2 tracks", icon: <Music2 size={24} />, count: userProfile.upload_count || 0, target: 2 },
        { label: "Boost Tracks", description: "Boost tracks to reach more listeners", icon: <Zap size={24} />, count: userProfile.boost_count || 0, target: 2 },
        { label: "Stream Music", description: "Listen to at least 5 full tracks", icon: <Radio size={24} />, count: userProfile.stream_count || 0, target: 5 },
        { label: "Like Music", description: "Heart 3 of your favorite songs", icon: <Heart size={24} />, count: userProfile.like_count || 0, target: 3 },
        { label: "Tip Artists", description: "Support other creators with tips", icon: <Coins size={24} />, count: userProfile.tip_count || 0, target: 2 },
      ]
    : [
        { label: "Stream Music", description: "Listen to at least 5 full tracks", icon: <Radio size={24} />, count: userProfile.stream_count || 0, target: 5 },
        { label: "Like Music", description: "Heart 3 of your favorite songs", icon: <Heart size={24} />, count: userProfile.like_count || 0, target: 3 },
        { label: "Tip Artists", description: "Support your favorite creators", icon: <Coins size={24} />, count: userProfile.tip_count || 0, target: 1 },
      ];

  const premiumKpis = [
    { label: "Purchase Music", description: "Buy a music NFT to own it forever", count: userProfile.purchase_count || 0 },
    { label: "Subscribe to Premium", description: "Unlock unlimited perks", count: userProfile.subscribe_count || 0 },
  ];

  const standardCompleted = standardKpis.every((kpi) => Number(kpi.count) >= kpi.target);
  const premiumCompleted = (Number(userProfile.purchase_count) >= 1) || (Number(userProfile.subscribe_count) >= 1);
  const allCompleted = standardCompleted && premiumCompleted;

  const isClaimed = userProfile.bounty_claimed;

  const handleClaim = async () => {
    const result = await claimKpiBounty();
    if (result?.digest) {
      setSuccess(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hackathon Quests & Bounties</h1>
        <p>Complete these on-chain tasks to claim your KPI Bounty Drop. Your progress is synced directly from the {isArtist ? "Artist" : "Listener"} smart contract!</p>
      </div>

      <div className={styles.premiumInfo}>
        <Star size={24} />
        <span>To unlock the final claim, you must complete all standard quests PLUS at least one Premium Action (Purchase Music OR Subscribe).</span>
      </div>

      <div className={styles.questList}>
        <h2>Standard Actions</h2>
        {standardKpis.map((kpi, index) => {
          const completed = Number(kpi.count) >= kpi.target;
          const progressPercent = Math.min(100, (Number(kpi.count) / kpi.target) * 100);

          return (
            <div key={index} className={styles.questItem}>
              <div className={styles.questInfo}>
                <div className={styles.questIcon}>{kpi.icon}</div>
                <div className={styles.questText}>
                  <h3>{kpi.label}</h3>
                  <p>{kpi.description}</p>
                </div>
              </div>

              <div className={styles.progressContainer}>
                <div className={`${styles.progressText} ${completed ? styles.completed : ""}`}>
                  {Number(kpi.count)} / {kpi.target}
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${completed ? styles.completed : ""}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.questList}>
        <h2>Premium Actions (Complete 1 of 2)</h2>
        {premiumKpis.map((kpi, index) => {
          const completed = Number(kpi.count) >= 1;
          const progressPercent = Math.min(100, (Number(kpi.count) / 1) * 100);

          return (
            <div key={`prem-${index}`} className={styles.questItem} style={{ borderColor: completed ? "rgba(74, 222, 128, 0.4)" : "" }}>
              <div className={styles.questInfo}>
                <div className={styles.questIcon} style={{ color: completed ? "#4ade80" : "" }}><Star size={24} /></div>
                <div className={styles.questText}>
                  <h3>{kpi.label}</h3>
                  <p>{kpi.description}</p>
                </div>
              </div>

              <div className={styles.progressContainer}>
                <div className={`${styles.progressText} ${completed ? styles.completed : ""}`}>
                  {completed ? "Done" : "Pending"}
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${completed ? styles.completed : ""}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.bountySection}>
        {isClaimed || success ? (
          <div className={styles.bountyStatus}>
            <CheckCircle size={32} />
            Congratulations! Bounty Successfully Claimed.
          </div>
        ) : (
          <>
            <Button
              variant="btn-primary"
              onClick={handleClaim}
              disabled={!allCompleted || loading}
              style={{ padding: "1.25rem 3rem", fontSize: "1.1rem" }}
              icon={<Gift size={24} />}
            >
              {loading ? "Processing Claim..." : allCompleted ? "Claim VIBE Reward Bounty" : "Complete Requirements to Unlock Claim"}
            </Button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </>
        )}
      </div>

      {loading && <TransactionLoader message="Claiming Bounty Drop..." />}
    </div>
  );
};

export default Quests;
