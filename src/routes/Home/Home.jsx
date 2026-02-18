import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import MusicCard from "../../components/MusicCard/MusicCard";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { songs, artists } from "../../util/songList";
import Player from "../../components/Player/Player";
import { useAudio } from "../../hooks/useAudio";

const Home = () => {
  const { currentTrack } = useAudio();
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
            <p className={styles.title}>{currentTrack?.title}</p>
            <p className={styles.artist}>{currentTrack?.artist}</p>
          </div>
          <div className={styles.playerContainer}>
            <Player />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>New Releases</h2>
        <div className={styles.musicGrid}>
          {songs.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Artists</h2>
        <div className={styles.artistList}>
          {artists.slice(0, 4).map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
