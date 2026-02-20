import React, { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./CreatePlaylistModal.module.css";
import { ListMusic } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreate(playlistName.trim());
      setPlaylistName("");
      onClose();
    }
  };

  const handleClose = () => {
    setPlaylistName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="small">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <ListMusic size={40} />
        </div>
        <h2 className={styles.title}>Create New Playlist</h2>
        <p className={styles.subtitle}>
          Give your playlist a name to get started
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="My Playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              autoFocus
              maxLength={50}
            />
            <span className={styles.charCount}>{playlistName.length}/50</span>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!playlistName.trim()}>
              Create Playlist
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePlaylistModal;
