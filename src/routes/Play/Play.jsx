import React from "react";
import styles from "./Play.module.css";
import Artist1 from "../../assets/artist11.png";
import Artist2 from "../../assets/artist12.png";
import Artist3 from "../../assets/artist13.png";
import Artist4 from "../../assets/artist14.png";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Button from "../../components/Button/Button";
import { Ellipsis, Heart, Menu, Plus } from "lucide-react";

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
    <div className={styles.playContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.nowPlaying}>
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
        <section className={styles.featuredArtists}>
          <h2 className={styles.featuredTitle}>Featured Artist</h2>
          <div className={styles.artistList}>
            {artists.map((artist, index) => (
              <ArtistCard artist={artist} key={index} />
            ))}
          </div>
        </section>
      </div>
      <div className={styles.rightContainer}></div>
    </div>
  );
};

export default Play;
