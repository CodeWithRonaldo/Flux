import React from "react";
import Modal from "../Modal/Modal";
import styles from "./RoleSelectionModal.module.css";
import { Headphones, Music } from "lucide-react";
import Button from "../Button/Button";

const RoleSelectionModal = ({ isOpen, onSelectRole}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onSelectRole(null)} size="large">
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Flux</h1>
          <p className={styles.subtitle}>How will you use Flux today?</p>
        </div>
        <div className={styles.roleCards}>
          <div
            className={styles.roleCard}
            onClick={() => onSelectRole("listener")}
          >
            <div className={styles.iconWrapper}>
              <Headphones size={48} />
            </div>
            <h2 className={styles.roleTitle}>I want to listen</h2>
            <p className={styles.roleDescription}>
              Discover and enjoy music from artists around the world. Purchase
              tracks and build your collection.
            </p>
            <Button variant="secondary">Continue as Listener</Button>
          </div>
          <div
            className={styles.roleCard}
            onClick={() => onSelectRole("artist")}
          >
            <div className={styles.iconWrapper}>
              <Music size={48} />
            </div>
            <h2 className={styles.roleTitle}>I want to create</h2>
            <p className={styles.roleDescription}>
              Upload your music, set your prices, and earn from your art.
              Connect with fans worldwide.
            </p>
            <Button>Continue as Artist</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoleSelectionModal;
