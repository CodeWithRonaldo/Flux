import styles from "./PlayListSelector.module.css";
import { Plus, Trash2 } from "lucide-react";
import { usePlaylist } from "../../hooks/usePlaylist";
import { BlackCard } from "../GlassCard/GlassCard";

const PlayListSelector = ({ onCreateClick, title = "My Playlists" }) => {
  const {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    deletePlaylist,
  } = usePlaylist();

  const handleSelect = (playlistId) => {
    setCurrentPlaylist(playlistId);
  };

  const handleDelete = (e, playlistId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlistId);
    }
  };

  return (
    <BlackCard className={styles.container}>
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <button
          className={styles.addButton}
          onClick={onCreateClick}
          title="Create new playlist"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className={styles.playlistList}>
        {playlists.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No playlists yet</p>
            <span>Create your first playlist to get started</span>
          </div>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`${styles.playlistItem} ${
                currentPlaylist === playlist.id ? styles.active : ""
              }`}
              onClick={() => handleSelect(playlist.id)}
            >
              <div className={styles.playlistInfo}>
                <span className={styles.playlistName}>{playlist.name}</span>
                <span className={styles.songCount}>
                  {playlist.songs.length} songs
                </span>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDelete(e, playlist.id)}
                title="Delete playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <button className={styles.createButton} onClick={onCreateClick}>
        <Plus size={18} />
        <span>Create New Playlist</span>
      </button>
    </BlackCard>
  );
};

export default PlayListSelector;
