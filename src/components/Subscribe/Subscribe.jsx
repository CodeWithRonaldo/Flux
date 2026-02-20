import React, { useState } from "react";
import { BlackCard } from "../GlassCard/GlassCard";
import Modal from "../Modal/Modal";
import { AudioWaveform, Music, Sparkles, Star, CheckCircle, Loader2 } from "lucide-react";
import Button from "../Button/Button";
import styles from "./Subscribe.module.css";

const Subscribe = ({ isOpen, OnClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    OnClose();
  } 

  const perks = [
    {
      icon: <Music size={38} absoluteStrokeWidth />,
      title: "Ad-free music",
      description: "Enjoy uninterrupted music with no ads.",
    },
    {
      icon: <Sparkles size={38} absoluteStrokeWidth />,
      title: "Exclusive content and early releases",
      description:
        "Access exclusive content and early releases before they're available to the public.",
    },
    {
      icon: <AudioWaveform size={38} absoluteStrokeWidth />,
      title: "High-quality audio",
      description: "Listen to music in high-quality audio with superior sound.",
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      {success ? (
        <div className={styles.successContainer}>
          <CheckCircle size={80} color="var(--color-primary)" />
          <h2 className={styles.successTitle}>Welcome to Premium!</h2>
          <p className={styles.description}>
            You now have access to all premium features. Enjoy unlimited ad-free music!
          </p>
        </div>
      ) : (
        <div className={styles.container}>
          <h2 className={styles.title}>Upgrade to premium</h2>
          <p className={styles.description}>
            Get ad-free music, offline listening, and more. Try it free for 1
            month.
          </p>

          <div className={styles.price}>
            <span className={styles.currentPrice}>$9.99/month</span>
            {/* <span className={styles.originalPrice}>$14.99/month</span> */}
          </div>

          <ul className={styles.perksList}>
            {perks.map((perk, index) => (
              <li key={index} className={styles.perkItem}>
                {perk.icon}
                <div>
                  <h3 className={styles.perkTitle}>{perk.title}</h3>
                  <p className={styles.perkDescription}>{perk.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button onClick={handleSubmit} className={styles.subscribeButton} disabled={isLoading}>
            {isLoading ? <Loader2 className={styles.spinner} size={20} /> : "Subscribe Now"}
          </Button>
        </div>
      )}

      
    </Modal>
  );
};

export default Subscribe;
