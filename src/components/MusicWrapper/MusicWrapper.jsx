import React from "react";
import styles from "./MusicWrapper.module.css";
import TrackList from "../TrackList/TrackList";
import { BlackCard } from "../GlassCard/GlassCard";
import { AudioLines, Home, PlusCircle } from "lucide-react";
const MusicWrapper = ({ children, songs, playlist = false }) => {
  const myPlaylist = songs.slice(0, 8);
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>{children}</div>
      <div className={styles.rightContainer}>
        <TrackList title="Top 100 Global Songs" songs={songs} />
        {playlist && (
          <BlackCard className={styles.playlistCard}>
            <div className={styles.header}>
              <div className={styles.title}>
                <Home color="white" size={18} />
                <h2>Your Playlist</h2>
              </div>
              <PlusCircle color="white" size={18} />
            </div>
            <div className={styles.playlistList}>
              {myPlaylist.map((song, index) => (
                <div key={index} className={styles.playlistItem}>
                  <p>{song.title}</p>
                  <AudioLines color="red" size={18} />
                </div>
              ))}
            </div>
          </BlackCard>
        )}
      </div>
    </div>
  );
};

export default MusicWrapper;
