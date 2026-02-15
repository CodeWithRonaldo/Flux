import React from "react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import styles from "./Library.module.css";
import TrackList from "../../components/TrackList/TrackList";
import { songs } from "../../util/songList";
import { BlackCard } from "../../components/GlassCard/GlassCard";

const Library = () => {
  return (
    <MusicWrapper songs={songs}>
      <TrackList
        title="Your Library"
        songs={songs}
        initialShow={10}
        hasSearch={true}
      />
    </MusicWrapper>
  );
};

export default Library;
