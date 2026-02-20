import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./RenamePlaylistModal.module.css";
import { Edit3 } from "lucide-react";

const RenamePlaylistModal = ({ isOpen, onClose, onRename, currentName }) => {
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    if (isOpen && currentName) {
      setPlaylistName(currentName);
    }
  }, [isOpen, currentName]);

  const handleRename = () => {
    if (playlistName.trim() && playlistName.trim() !== currentName) {
      onRename(playlistName.trim());
      setPlaylistName("");
      onClose();
    }
  };

  const handleClose = () => {
    setPlaylistName("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="small">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Edit3 size={40} />
        </div>
        <h2 className={styles.title}>Rename Playlist</h2>
        <p className={styles.subtitle}>Update the name of your playlist</p>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={50}
            />
            <span className={styles.charCount}>{playlistName.length}/50</span>
          </div>

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={
                !playlistName.trim() || playlistName.trim() === currentName
              }
            >
              Rename
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RenamePlaylistModal;
