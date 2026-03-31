import { useState } from "react";
import styles from "./Search.module.css";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { useNavigate } from "react-router-dom";
import TrackList from "../../components/TrackList/TrackList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Clock } from "lucide-react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import TrackItem from "../../components/TrackItem/TrackItem";
import { BlackCard } from "../../components/GlassCard/GlassCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const { musics, isPending } = useFetchMusic();
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("flux_recent_searches");
    return saved ? JSON.parse(saved) : [];
  });

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const newRecent = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 8);
    setRecentSearches(newRecent);
    localStorage.setItem("flux_recent_searches", JSON.stringify(newRecent));
  };

  const filteredMusics =
    query.trim() === ""
      ? []
      : musics?.filter(
          (m) =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.artist.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <MusicWrapper musics={musics} isPending={isPending} showTrackList={false}>
      <BlackCard className={styles.searchPage}>
        <div className={styles.header}>
          <SearchBar
            className={styles.searchBar}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.content}>
          {query.trim() === "" ? (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <h3 className={styles.sectionTitle}>
                    <Clock size={16} />
                    Recent Searches
                  </h3>
                  <div className={styles.recentSearches}>
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className={styles.recentTag}
                        onClick={() => setQuery(term)}
                      >
                        {term}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.results}>
              <h2 className={styles.resultsTitle}>Search Results</h2>
              <div className={styles.songList}>
                {filteredMusics.map((music, index) => (
                  <div
                    key={music.music_id}
                    onClick={(e) => {
                      // Navigate only if they didn't click inside an inner action
                      if (e.target.closest("button")) return;
                      saveRecentSearch(query);
                      navigate(`/play/${music.music_id}`);
                    }}
                    className={styles.trackNavWrapper}
                  >
                    <TrackItem music={music} rank={index + 1} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BlackCard>
    </MusicWrapper>
  );
};

export default Search;
