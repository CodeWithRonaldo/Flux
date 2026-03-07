import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./RoleSelectionModal.module.css";
import { Headphones, Music, Loader2 } from "lucide-react";
import Button from "../Button/Button";
import ListenerOnboarding from "../ListenerOnboarding/ListenerOnboarding";
import ArtistOnboarding from "../ArtistOnboarding/ArtistOnboarding";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState("");
  const { registerUser, loading } = useVibetraxHook();

  const onListener = () => {
    setRole("listener");
  };
  const onArtist = () => {
    setRole("artist");
  };

  const handleComplete = async (data) => {
    const userData = {
      role,
      artistName: data.artistName || "",
      bio: data.bio || "",
      genre: data.genres || [],
    };

    await registerUser(userData);
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
      {role === "listener" && !loading && (
        <ListenerOnboarding onComplete={handleComplete} />
      )}
      {role === "artist" && !loading && (
        <ArtistOnboarding onComplete={handleComplete} />
      )}

      {loading && (
        <div className={styles.loading}>
          <Loader2 size={48} />
          <p>Registering {role}...</p>
        </div>
      )}
    </Modal>
  );
};

export default RoleSelectionModal;
