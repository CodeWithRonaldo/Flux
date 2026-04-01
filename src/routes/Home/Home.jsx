import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import MusicCard from "../../components/MusicCard/MusicCard";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Player from "../../components/Player/Player";
import { useAudio } from "../../hooks/useAudio";
import { useState } from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  LoadingState,
  EmptyState,
} from "../../components/StateDisplay/StateDisplay";
import { Music } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsSearchOpen } = useSearch();
  const { musics, isPending } = useFetchMusic();
  const { registeredArtists, currentUser } = useOutletContext();
  const navigate = useNavigate();

  const trendingMusics = [...musics].filter(
    (m) => m.streaming_count > 0 || m.likes > 0,
  );

  const handleSearchClick = () => {
    if (window.innerWidth <= 768) navigate("/search");
    else setIsSearchOpen(true);
  };

  const { currentTrack } = useAudio();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = currentUser?.username ? `, ${currentUser.username}` : "";

  return (
    <div className={styles.homeContainer}>
      <Subscribe isOpen={isOpen} OnClose={() => setIsOpen(false)} />

      <section
        className={styles.heroContainer}
        style={{
          background: currentTrack
            ? `linear-gradient(to right, rgba(18, 18, 18, 0.95) 20%, rgba(18, 18, 18, 0.7) 100%), url(${currentTrack.music_image}) center/cover no-repeat`
            : "rgba(255, 255, 255, 0.02)",
        }}
      >
        <div className={styles.left}>
          <h1 className={styles.title}>
            {greeting}
            {userName}!
          </h1>
          <p className={styles.desc}>
            Ready to discover your next vibe? Search for tracks or explore the
            new releases below.
          </p>
          <SearchBar
            className={styles.searchBar}
            value=""
            readOnly={true}
            onClick={handleSearchClick}
            onChange={() => {}}
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
        ) : musics.length === 0 ? (
          <EmptyState
            icon={<Music size={40} />}
            title="No tracks yet"
            description="No music has been uploaded yet."
          />
        ) : (
          <div className={styles.horizontalScroll}>
            {musics.slice(0, 8).map((music) => (
              <div key={music.music_id} className={styles.scrollItemWrapper}>
                <MusicCard music={music} />
              </div>
            ))}
          </div>
        )}
      </section>

      {trendingMusics.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
          </div>
          <div className={styles.horizontalScroll}>
            {trendingMusics.map((music) => (
              <div key={music.music_id} className={styles.scrollItemWrapper}>
                <MusicCard music={music} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Artists</h2>
        <div className={styles.horizontalScroll}>
          {registeredArtists?.slice(0, 8).map((artist, index) => (
            <div key={index} className={styles.artistScrollWrapper}>
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
