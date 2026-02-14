import React from "react";
import styles from "./MusicWrapper.module.css";
import TrackList from "../TrackList/TrackList";
const MusicWrapper = ({ children, songs }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {children}
      </div>
      <div className={styles.rightContainer}>
        <TrackList title="Top 100 Global Songs" songs={songs} />
      </div>
    </div>
  );
};

export default MusicWrapper;
