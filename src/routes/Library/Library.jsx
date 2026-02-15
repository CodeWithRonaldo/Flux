import React from "react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import styles from "./Library.module.css";
import TrackList from "../../components/TrackList/TrackList";
import { songs } from "../../util/songList";


const Library = () => {
  return (
    <MusicWrapper songs={songs}>
      <div className={styles.libraryContainer}>
        <TrackList title="Your Library" songs={songs} initialShow={10} hasSearch={true}/>
      </div>
      

    </MusicWrapper>
  );
};

export default Library;
