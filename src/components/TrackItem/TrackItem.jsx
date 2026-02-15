import { Ellipsis, Heart } from "lucide-react";
import React from "react";
import styles from "./TrackItem.module.css";

const TrackItem = ({ song, rank }) => {
  return (
    <div className={styles.trackItem}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.songInfo}>
        <img src={song.albumArt} alt={song.title} className={styles.albumArt} />
        <div className={styles.songDetails}>
          <div className={styles.title}>{song.title}</div>
          <div className={styles.artist}>{song.artist}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.duration}>{song.duration}</div>
        <button className={styles.iconButton}>
          <Heart />
        </button>
        <button className={styles.iconButton}>
          <Ellipsis />
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
