import { useState } from "react";
import styles from "./MusicWrapper.module.css";
import TrackList from "../TrackList/TrackList";
import PlayListSelector from "../PlayListSelector/PlayListSelector";
import PlayListModal from "../PlayListModal/PlayListModal";
import { usePlaylist } from "../../hooks/usePlaylist";

const MusicWrapper = ({
  children,
  songs,
  showTrackList = true,
  showPlaylistSelector = false,
  trackListTitle = "Top 100 Global Songs"
}) => {
  const { playlists, currentPlaylist, createPlaylist, setCurrentPlaylist } = usePlaylist();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get current songs based on selected playlist
  const getCurrentSongs = () => {
    if (currentPlaylist === "top100") {
      return songs;
    }
    const playlist = playlists.find((p) => p.id === currentPlaylist);
    return playlist ? playlist.songs : [];
  };

  const handleCreatePlaylist = (name) => {
    const newPlaylistId = createPlaylist(name);
    setCurrentPlaylist(newPlaylistId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>{children}</div>
      <div className={styles.rightContainer}>
        {showPlaylistSelector && (
          <PlayListSelector
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}
        {showTrackList && <TrackList title={trackListTitle} songs={getCurrentSongs()} />}
      </div>

      {showPlaylistSelector && (
        <PlayListModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
};

export default MusicWrapper;
