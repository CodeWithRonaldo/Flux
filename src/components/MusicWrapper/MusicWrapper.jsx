import React from "react";
import styles from "./MusicWrapper.module.css";
import TrackList from "../TrackList/TrackList";
import { BlackCard } from "../GlassCard/GlassCard";
const MusicWrapper = ({ children, songs }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>{children}</div>
      <div className={styles.rightContainer}>
        <BlackCard>
          <TrackList title="Top 100 Global Songs" songs={songs} />
        </BlackCard>
      </div>
    </div>
  );
};

export default MusicWrapper;
