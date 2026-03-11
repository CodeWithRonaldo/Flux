import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./RoleSelectionModal.module.css";
import { Headphones, Music, CheckCircle } from "lucide-react";
import Button from "../Button/Button";
import ListenerOnboarding from "../ListenerOnboarding/ListenerOnboarding";
import ArtistOnboarding from "../ArtistOnboarding/ArtistOnboarding";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useWeb3AuthUser } from "@web3auth/modal/react";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState("");
  const [done, setDone] = useState(false);
  const { registerUser, loading } = useVibetraxHook();
  const { userInfo } = useWeb3AuthUser();

  const onListener = () => setRole("listener");
  const onArtist = () => setRole("artist");

  const handleComplete = async (data) => {
    const userData = {
      role,
      artistName: data.artistName || userInfo?.name,
      bio: data.bio || "",
      genre: data.genres || [],
    };

    const result = await registerUser(userData);
    if (!result?.digest) return;
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      {role === "" && (
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome to Flux</h1>
            <p className={styles.subtitle}>How will you use Flux today?</p>
          </div>
          <div className={styles.roleCards}>
            <div className={styles.roleCard} onClick={onListener}>
              <div className={styles.iconWrapper}>
                <Headphones size={48} />
              </div>
              <h2 className={styles.roleTitle}>I want to listen</h2>
              <p className={styles.roleDescription}>
                Discover and enjoy music from artists around the world. Purchase
                tracks and build your collection.
              </p>
              <Button variant="btn-secondary" onClick={onListener}>
                Continue as Listener
              </Button>
            </div>
            <div className={styles.roleCard} onClick={onArtist}>
              <div className={styles.iconWrapper}>
                <Music size={48} />
              </div>
              <h2 className={styles.roleTitle}>I want to create</h2>
              <p className={styles.roleDescription}>
                Upload your music, set your prices, and earn from your art.
                Connect with fans worldwide.
              </p>
              <Button onClick={onArtist}>Continue as Artist</Button>
            </div>
          </div>
        </div>
      )}

      {role !== "" &&
        !loading &&
        !done &&
        (role === "listener" ? (
          <ListenerOnboarding onComplete={handleComplete} />
        ) : (
          <ArtistOnboarding onComplete={handleComplete} />
        ))}

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingOrb}>
            <div className={styles.orbRing} />
            <div className={styles.orbRing} />
            <div className={styles.orbRing} />
            <div className={styles.orbIcon}>
              {role === "listener" ? (
                <Headphones size={32} />
              ) : (
                <Music size={32} />
              )}
            </div>
          </div>
          <h2 className={styles.loadingTitle}>Setting up your profile</h2>
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
          <p className={styles.successSubtitle}>
            Welcome to Flux as a{role === "artist" ? "n" : ""}{" "}
            <strong>{role}</strong>
          </p>
        </div>
      )}
    </Modal>
  );
};

export default RoleSelectionModal;
