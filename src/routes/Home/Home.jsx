import React from "react";
import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import Player from "../../assets/player.png";
import MusicCard from "../../components/MusicCard/MusicCard";
import { songs } from "../../util/songList";

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
          <SearchBar className={styles.searchBar} />
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
          {songs.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
