import React from "react";
import styles from "./Play.module.css";
import Artist1 from "../../assets/artist11.png";
import Artist2 from "../../assets/artist12.png";
import Artist3 from "../../assets/artist13.png";
import Artist4 from "../../assets/artist14.png";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Player from "../../assets/player.png";
import Button from "../../components/Button/Button";
import TrackList from "../../components/TrackList/TrackList";
import { Ellipsis, Heart, Menu, Plus } from "lucide-react";

import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs } from "../../util/songList";

const artists = [
  {
    name: "Freed",
    genre: "Afrobeat",
    image: Artist1,
  },
  {
    name: "AbdulKuduz",
    genre: "Hip-hop",
    image: Artist2,
  },
  {
    name: "Oracle",
    genre: "Takawaka",
    image: Artist3,
  },
  {
    name: "John Doe",
    genre: "Electronic",
    image: Artist4,
  },
  {
    name: "AbdulKuduz",
    genre: "Hip-hop",
    image: Artist2,
  },
  {
    name: "Oracle",
    genre: "Takawaka",
    image: Artist3,
  },
];



const Play = () => {
  return (
    <MusicWrapper songs={songs}>

        <div className={styles.nowPlaying}>
          <div className={styles.nowPlayingDetails}>
            <h4 className={styles.nowPlayingTitle}>Now Playing</h4>
            <div>
              <h1 className={styles.nowPlayingTrack}>The girl in lemonade</h1>
              <p className={styles.nowPlayingArtist}>Freed ft AbdulKuduz</p>
            </div>
            <div className={styles.nowPlayingActions}>
              <Ellipsis size={30} className={styles.icons} />
              <Heart size={30} className={styles.icons} />
              <Plus size={30} className={styles.icons} />
            </div>
          </div>
          <div className={styles.nowPlayingPlayer}>
            <img src={Player} alt="player" />
          </div>
        </div>
        <section className={styles.featuredArtists}>
          <h2 className={styles.featuredTitle}>Featured Artist</h2>
          <div className={styles.artistList}>
            {artists.map((artist, index) => (
              <ArtistCard artist={artist} key={index} />
            ))}
          </div>
        </section>
    </MusicWrapper>
     
  );
};

export default Play;
