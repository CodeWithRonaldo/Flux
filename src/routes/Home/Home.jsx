import React from "react";
import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import Player from "../../assets/player.png";
import MusicCard from "../../components/MusicCard/MusicCard";
import Music1 from "../../assets/fakelove.jpg";
import Music2 from "../../assets/money-album.jpg";
import Music3 from "../../assets/my_heart.jpeg";

const tracks = [
  {
    id: 1,
    title: "The girl in lemonade",
    artist: "Freed ft AbdulKuduz",
    music_art: Music1,
    type: "premium",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Another Song",
    artist: "Artist Name",
    music_art: Music2,
    type: "standard",
    duration: "4:20",
  },
  {
    id: 3,
    title: "Yet Another Song",
    artist: "Another Artist",
    music_art: Music3,
    type: "premium",
    duration: "5:10",
  },
  {
    id: 4,
    title: "The girl in lemonade",
    artist: "Freed ft AbdulKuduz",
    music_art: Music1,
    type: "standard",
    duration: "3:45",
  },
  {
    id: 5,
    title: "Another Song",
    artist: "Artist Name",
    music_art: Music2,
    type: "standard",
    duration: "4:20",
  },
  {
    id: 6,
    title: "Yet Another Song",
    artist: "Another Artist",
    music_art: Music3,
    type: "standard",
    duration: "5:10",
  },
  {
    id: 7,
    title: "Another Song",
    artist: "Artist Name",
    music_art: Music2,
    type: "Premium",
    duration: "4:20",
  },
  {
    id: 8,
    title: "Yet Another Song",
    artist: "Another Artist",
    music_art: Music3,
    type: "standard",
    duration: "5:10",
  },
];

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroContainer}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            THE MULTI-UNIVERSAL <br /> MUSIC PLAYLIST
          </h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eum
            laudantium unde. Placeat delectus, aliquid eius repellendus, animi
            eum ducimus veritatis voluptatem dolorum, et odit! Inventore
            assumenda aut quaerat eligendi accusantium, maiores impedit eos sed.
            Velit veritatis asperiores aperiam quae temporibus, nihil voluptatum
            rerum alias illum, corporis, doloremque.
          </p>
          <SearchBar />
        </div>
        <div className={styles.right}>
          <div className={styles.music}>
            <p className={styles.title}>The girl in lemonade dress</p>
            <p className={styles.artist}>Freed ft AbdulKuduz</p>
          </div>
          <div className={styles.player}>
            <img src={Player} alt="Music Player" />
          </div>
        </div>
      </section>

      <section className={styles.newReleases}>
        <h2 className={styles.sectionTitle}>New Releases</h2>
        <div className={styles.musicGrid}>
          {tracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
