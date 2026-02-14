import { Ellipsis, Heart } from "lucide-react";
import React from "react";
import styles from "./TrackItem.module.css";

const TrackItem = ({rank, albumArt,title, artist, duration, onLike, onMore}) => {
  return (
    <div className={styles.trackItem}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.songInfo}>
        <img src={albumArt} alt={title} className={styles.albumArt}/>
        <div className={styles.songDetails}>
            <div className={styles.title}>{title}</div>
            <div className={styles.artist}>{artist}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.duration}>{duration}</div>
        <button onClick={onLike} className={styles.iconButton}><Heart /></button>
        <button onClick={onMore} className={styles.iconButton}><Ellipsis /></button>
      </div>
    </div>
  );
};

export default TrackItem;
