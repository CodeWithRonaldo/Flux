import { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./AddToPlaylistModal.module.css";
import { ListPlus, Check, Plus } from "lucide-react";
import { usePlaylist } from "../../hooks/usePlaylist";

const AddToPlaylistModal = ({ isOpen, onClose, song, onCreatePlaylist }) => {
  const { playlists, addSongToPlaylist } = usePlaylist();
  const [addedPlaylists, setAddedPlaylists] = useState(new Set());

  const handleAddToPlaylist = (playlistId) => {
    addSongToPlaylist(playlistId, song);
    setAddedPlaylists(prev => new Set([...prev, playlistId]));

    // Remove from added set after animation
    setTimeout(() => {
      setAddedPlaylists(prev => {
        const newSet = new Set(prev);
        newSet.delete(playlistId);
        return newSet;
      });
    }, 2000);
  };

  const isSongInPlaylist = (playlist) => {
    return playlist.songs.some(s => s.id === song?.id);
  };

  const handleClose = () => {
    setAddedPlaylists(new Set());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <ListPlus size={40} />
        </div>
        <h2 className={styles.title}>Add to Playlist</h2>
        <p className={styles.subtitle}>
          Choose a playlist to add "{song?.title}"
        </p>

        <div className={styles.playlistList}>
          {playlists.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No playlists yet</p>
              <span>Create your first playlist to get started</span>
            </div>
          ) : (
            playlists.map((playlist) => {
              const isInPlaylist = isSongInPlaylist(playlist);
              const justAdded = addedPlaylists.has(playlist.id);

              return (
                <div
                  key={playlist.id}
                  className={`${styles.playlistItem} ${
                    isInPlaylist ? styles.inPlaylist : ""
                  } ${justAdded ? styles.justAdded : ""}`}
                  onClick={() => !isInPlaylist && handleAddToPlaylist(playlist.id)}
                >
                  <div className={styles.playlistInfo}>
                    <span className={styles.playlistName}>{playlist.name}</span>
                    <span className={styles.songCount}>
                      {playlist.songs.length} songs
                    </span>
                  </div>
                  <div className={styles.status}>
                    {justAdded ? (
                      <div className={styles.addedIcon}>
                        <Check size={18} />
                        <span>Added!</span>
                      </div>
                    ) : isInPlaylist ? (
                      <div className={styles.inPlaylistIcon}>
                        <Check size={18} />
                      </div>
                    ) : (
                      <div className={styles.addIcon}>
                        <Plus size={18} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button className={styles.createButton} onClick={onCreatePlaylist}>
          <Plus size={18} />
          <span>Create New Playlist</span>
        </button>
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
