import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import MusicCard from "../../components/MusicCard/MusicCard";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { songs, artists } from "../../util/songList";
import Player from "../../components/Player/Player";
import { useAudio } from "../../hooks/useAudio";
import { useState } from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { useOutletContext } from "react-router-dom";
import { LoadingState, EmptyState } from "../../components/StateDisplay/StateDisplay";
import { Music } from "lucide-react";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { musics, isPending, isError } = useFetchMusic();
  const registeredUsers = useOutletContext();

  // console.log(musics);

  const { currentTrack } = useAudio();

  const filteredMusics = musics?.filter(
    (music) =>
      music?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      music?.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.homeContainer}>
      <Subscribe isOpen={isOpen} OnClose={() => setIsOpen(false)} />

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
          <SearchBar
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.music}>
            <p className={styles.title}>{currentTrack?.title}</p>
            <p className={styles.artist}>{currentTrack?.artist.name}</p>
          </div>
          <div className={styles.playerContainer}>
            <Player />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>New Releases</h2>
        {isPending && musics.length === 0 ? (
          <LoadingState message="Loading tracks..." />
        ) : filteredMusics.length === 0 ? (
          <EmptyState
            icon={<Music size={40} />}
            title={searchQuery ? "No results found" : "No tracks yet"}
            description={
              searchQuery
                ? `Nothing matched "${searchQuery}". Try a different search.`
                : "No music has been uploaded yet."
            }
          />
        ) : (
          <div className={styles.musicGrid}>
            {filteredMusics.map((music) => (
              <MusicCard key={music.music_id} music={music} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Artists</h2>
        <div className={styles.artistList}>
          {registeredUsers?.slice(0, 4).map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
