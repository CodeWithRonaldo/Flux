import { useEffect, useState } from "react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import styles from "./Library.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import MusicCard from "../../components/MusicCard/MusicCard";
import Button from "../../components/Button/Button";
import TrackList from "../../components/TrackList/TrackList";
import Player from "../../components/Player/Player";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { BanknoteArrowUp, Ellipsis, Heart, Plus } from "lucide-react";
import { BlackCard } from "../../components/GlassCard/GlassCard";
import { useIota } from "../../hooks/useIota";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useFetchLikes } from "../../hooks/useFetchLikes";
import { usePlaylist } from "../../hooks/usePlaylist";
import TipModal from "../../components/TipModal/TipModal";
import BoostModal from "../../components/BoostModal/BoostModal";
import AddToPlaylistModal from "../../components/AddToPlaylistModal/AddToPlaylistModal";
import PlayListModal from "../../components/PlayListModal/PlayListModal";

const Library = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { musics, isPending, isError } = useFetchMusic();
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const { address } = useIota();
  const registeredUsers = useOutletContext();
  const navigate = useNavigate();
  const { likeMusic, toggleSale, deleteMusic } = useVibetraxHook();
  const { likedIds } = useFetchLikes();
  const [optimisticLikes, setOptimisticLikes] = useState(new Set());
  const { createPlaylist, setCurrentPlaylist } = usePlaylist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

  const currentUser = registeredUsers?.filter((user) => user.owner === address);
  const effectiveLikedIds = new Set([...likedIds, ...optimisticLikes]);

  const featuredSongs = musics?.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredSongs.length]);

  const currentFeatured = featuredSongs[currentFeaturedIndex];

  const showEditButton =
    currentFeatured?.current_owner?.user_address === currentFeatured?.artist?.user_address &&
    currentFeatured?.current_owner?.user_address === address;

  const handleLike = async () => {
    if (!currentFeatured || !address) return;
    const musicId = currentFeatured.music_id;
    if (effectiveLikedIds.has(musicId)) return;
    const name = currentUser?.[0]?.username || currentUser?.[0]?.role || "user";
    const role = currentUser?.[0]?.role || "listener";
    setOptimisticLikes((prev) => new Set([...prev, musicId]));
    const result = await likeMusic({ musicId, likerName: name, likerRole: role });
    if (!result) {
      setOptimisticLikes((prev) => {
        const next = new Set(prev);
        next.delete(musicId);
        return next;
      });
    }
  };

  const handleCreatePlaylistFromModal = () => {
    setIsAddToPlaylistOpen(false);
    setIsCreatePlaylistOpen(true);
  };

  const handleCreatePlaylist = (name) => {
    const newPlaylistId = createPlaylist(name);
    setCurrentPlaylist(newPlaylistId);
    setIsCreatePlaylistOpen(false);
    setIsAddToPlaylistOpen(true);
  };

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
                <div className={styles.bannerIconActions}>
                  {showEditButton && (
                    <div className={styles.tooltipWrapper}>
                      <Ellipsis
                        size={30}
                        className={styles.icons}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      />
                      <span className={styles.tooltip}>More options</span>
                    </div>
                  )}
                  <div className={styles.tooltipWrapper} onClick={handleLike}>
                    <Heart
                      size={30}
                      className={styles.icons}
                      fill={effectiveLikedIds.has(currentFeatured?.music_id) ? "currentColor" : "none"}
                      style={{ cursor: effectiveLikedIds.has(currentFeatured?.music_id) ? "default" : "pointer" }}
                    />
                    <span className={styles.tooltip}>
                      {effectiveLikedIds.has(currentFeatured?.music_id)
                        ? `${(Number(currentFeatured?.likes ?? 0) + 1).toLocaleString()} likes`
                        : `${Number(currentFeatured?.likes ?? 0).toLocaleString()} likes`}
                    </span>
                  </div>
                  <div className={styles.tooltipWrapper}>
                    <Plus
                      size={30}
                      className={styles.icons}
                      onClick={() => setIsAddToPlaylistOpen(true)}
                    />
                    <span className={styles.tooltip}>Add to playlist</span>
                  </div>
                  <div
                    className={styles.tooltipWrapper}
                    onClick={() => setIsTipModalOpen(true)}
                  >
                    <BanknoteArrowUp size={30} className={styles.icons} />
                    <span className={styles.tooltip}>Tip Artist</span>
                  </div>
                  {isMenuOpen && (
                    <BlackCard className={styles.menuCard}>
                      <ul>
                        <li onClick={() => { setIsMenuOpen(false); navigate(`/upload/${currentFeatured?.music_id}`); }}>Edit Track</li>
                        <li onClick={async () => { setIsMenuOpen(false); await toggleSale(currentFeatured?.music_id); }}>
                          {currentFeatured?.for_sale ? "Remove From Sale" : "Put on Sale"}
                        </li>
                        <li onClick={() => { setIsMenuOpen(false); setIsBoostModalOpen(true); }}>Boost Music</li>
                        <li onClick={async () => {
                          if (!window.confirm("Delete this track? This cannot be undone.")) return;
                          setIsMenuOpen(false);
                          const result = await deleteMusic(currentFeatured?.music_id);
                          if (result) navigate("/");
                        }}>Delete Track</li>
                      </ul>
                    </BlackCard>
                  )}
                </div>
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
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        music={currentFeatured}
      />
      <TipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        music={currentFeatured}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        music={currentFeatured}
        onCreatePlaylist={handleCreatePlaylistFromModal}
      />
      <PlayListModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </MusicWrapper>
  );
};

export default Library;
