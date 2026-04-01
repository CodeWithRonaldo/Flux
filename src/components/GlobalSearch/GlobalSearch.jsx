import { useEffect, useState, useRef } from "react";
import { Search, Clock } from "lucide-react";
import styles from "./GlobalSearch.module.css";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import Modal from "../Modal/Modal";
import TrackList from "../TrackList/TrackList";
import { useSearch } from "../../hooks/useSearch";

const GlobalSearch = () => {
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [query, setQuery] = useState("");
  const { musics, isPending } = useFetchMusic();
  const inputRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("flux_recent_searches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD/CTRL + K to open search globally
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen]);

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const newRecent = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 8);
    setRecentSearches(newRecent);
    localStorage.setItem("flux_recent_searches", JSON.stringify(newRecent));
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
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
    <Modal isOpen={isSearchOpen} onClose={handleClose} size="large">
      <div className={styles.container}>
        <div className={styles.header}>
          <Search size={22} color="rgba(255,255,255,0.5)" />
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Search for songs, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRecentSearch(query);
            }}
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
            <TrackList
              title="Search Results"
              musics={filteredMusics}
              isPending={isPending}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearch;
