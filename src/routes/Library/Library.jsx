import { useEffect, useState } from "react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import styles from "./Library.module.css";
import { songs } from "../../util/songList";
import SearchBar from "../../components/SearchBar/SearchBar";
import MusicCard from "../../components/MusicCard/MusicCard";
import Button from "../../components/Button/Button";
import TrackList from "../../components/TrackList/TrackList";
import Player from "../../components/Player/Player";
import { useFetchMusic } from "../../hooks/useFetchMusic";

const Library = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { musics, isPending, isError } = useFetchMusic();
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const featuredSongs = musics?.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredSongs.length]);

  const currentFeatured = featuredSongs[currentFeaturedIndex];

  const filters = ["All", "Premium", "Standard"];

  const filteredSongs = musics?.filter((music) => {
    const matchesSearch =
      music?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      music?.artist.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery !== "") return matchesSearch;

    if (activeFilter === "All") return true;
    return music?.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <MusicWrapper musics={musics}>
      <div className={styles.libraryContainer}>
        <section className={styles.topSection}>
          <div className={styles.header}>
            <h1 className={styles.libraryTitle}>Explore</h1>
            <SearchBar
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery === "" && (
            <div
              className={styles.featuredBanner}
              style={{
                background: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url(${currentFeatured?.music_image}) center/cover no-repeat`,
                transition: "background 0.5s ease-in-out",
              }}
            >
              <div className={styles.bannerContent}>
                <span className={styles.bannerLabel}>Featured Track</span>
                <h2 className={styles.bannerTitle}>{currentFeatured?.title}</h2>
                <p className={styles.bannerArtist}>
                  {currentFeatured?.artist.name}
                </p>
              </div>
              <div className={styles.bannerActions}>
                <Player
                  music={currentFeatured}
                  className={styles.bannerPlayer}
                />
              </div>
            </div>
          )}
        </section>

        <section className={styles.collectionSection}>
          {searchQuery === "" ? (
            <>
              <div className={styles.filterBar}>
                <div className={styles.filters}>
                  {filters.map((filter) => (
                    <Button
                      key={filter}
                      variant={
                        activeFilter === filter ? "btn-primary" : "btn-ghost"
                      }
                      onClick={() => setActiveFilter(filter)}
                      className={styles.filterBtn}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className={styles.musicGrid}>
                {filteredSongs.map((music) => (
                  <MusicCard key={music?.music_id} music={music} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.searchResults}>
              <h2 className={styles.sectionTitle}>Search Results</h2>
              <TrackList musics={filteredSongs} />
            </div>
          )}
        </section>
      </div>
    </MusicWrapper>
  );
};

export default Library;
