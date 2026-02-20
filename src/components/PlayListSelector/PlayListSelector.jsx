import { useState } from "react";
import styles from "./PlayListSelector.module.css";
import { Plus, Trash2, Edit3, ChevronDown, X } from "lucide-react";
import { usePlaylist } from "../../hooks/usePlaylist";
import { BlackCard } from "../GlassCard/GlassCard";
import RenamePlaylistModal from "../RenamePlaylistModal/RenamePlaylistModal";
import TrackItem from "../TrackItem/TrackItem";
import Button from "../Button/Button";

const PlayListSelector = ({ onCreateClick, title = "My Playlists" }) => {
  const {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    deletePlaylist,
    renamePlaylist,
    removeSongFromPlaylist,
  } = usePlaylist();

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [playlistToRename, setPlaylistToRename] = useState(null);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const handleSelect = (playlistId) => {
    setCurrentPlaylist(playlistId);
  };

  const handleToggleExpand = (e, playlistId) => {
    e.stopPropagation();
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  const handleDelete = (e, playlistId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlistId);
    }
  };

  const handleRenameClick = (e, playlist) => {
    e.stopPropagation();
    setPlaylistToRename(playlist);
    setRenameModalOpen(true);
  };

  const handleRename = (newName) => {
    if (playlistToRename) {
      renamePlaylist(playlistToRename.id, newName);
      setPlaylistToRename(null);
    }
  };

  const handleRemoveSong = (e, playlistId, songId) => {
    e.stopPropagation();
    removeSongFromPlaylist(playlistId, songId);
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
          playlists.map((playlist) => {
            const isExpanded = expandedPlaylist === playlist.id;
            return (
              <div key={playlist.id} className={styles.playlistWrapper}>
                <div
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
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.expandButton}
                      onClick={(e) => handleToggleExpand(e, playlist.id)}
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      <ChevronDown
                        size={16}
                        className={isExpanded ? styles.chevronExpanded : ""}
                      />
                    </button>
                    <button
                      className={styles.editButton}
                      onClick={(e) => handleRenameClick(e, playlist)}
                      title="Rename playlist"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(e, playlist.id)}
                      title="Delete playlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.expandedContent}>
                    {playlist.songs.length === 0 ? (
                      <div className={styles.emptyPlaylist}>
                        <p>No songs in this playlist yet</p>
                      </div>
                    ) : (
                      <div className={styles.songsList}>
                        {playlist.songs.map((song, index) => (
                          <div key={song.id} className={styles.songItemWrapper}>
                            <TrackItem song={song} rank={index + 1} />
                            <button
                              className={styles.removeSongButton}
                              onClick={(e) =>
                                handleRemoveSong(e, playlist.id, song.id)
                              }
                              title="Remove from playlist"
                            >
                              <X size={16} />
                            </button>
                            rgba(124, 58, 237, 0.2);
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Button variant="btn-ghost" onClick={onCreateClick}>
        <Plus size={18} />
        <span>Create New Playlist</span>
      </Button>

      <RenamePlaylistModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setPlaylistToRename(null);
        }}
        onRename={handleRename}
        currentName={playlistToRename?.name || ""}
      />
    </BlackCard>
  );
};

export default PlayListSelector;
