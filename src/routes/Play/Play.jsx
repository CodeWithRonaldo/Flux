import React, { useState, useEffect } from "react";
import styles from "./Play.module.css";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Button from "../../components/Button/Button";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import { BanknoteArrowUp, Ellipsis, Heart, Menu, Plus } from "lucide-react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs, artists } from "../../util/songList";
import PurchaseModal from "../../components/PurchaseModal/PurchaseModal";
import AddToPlaylistModal from "../../components/AddToPlaylistModal/AddToPlaylistModal";
import PlayListModal from "../../components/PlayListModal/PlayListModal";

import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAudio } from "../../hooks/useAudio";
import { BlackCard } from "../../components/GlassCard/GlassCard";
import { usePlaylist } from "../../hooks/usePlaylist";
import TipModal from "../../components/TipModal/TipModal";
import BoostModal from "../../components/BoostModal/BoostModal";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { formatPrice } from "../../util/helper";

const Play = () => {
  const { id } = useParams();
  const registeredUser = useOutletContext();
  const currentUser = registeredUser?.[0];
  const navigate = useNavigate();
  const { currentTrack, playTrack } = useAudio();
  const { createPlaylist, setCurrentPlaylist } = usePlaylist();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const { musics, isPending, isError } = useFetchMusic();

  // Sync context with URL param on mount or URL change
  useEffect(() => {
    if (id && currentTrack?.music_id !== parseInt(id)) {
      const songToPlay = musics?.find((s) => s.music_id === parseInt(id));
      if (songToPlay) {
        playTrack(songToPlay);
      }
    }
  }, []);
  // }, [id]);

  // Sync URL with context change (e.g. via Next/Prev buttons)
  useEffect(() => {
    if (currentTrack && id && currentTrack?.music_id !== parseInt(id)) {
      navigate(`/play/${currentTrack?.music_id}`, { replace: true });
    }
  }, [currentTrack, id]);

  const recentSongs = musics?.slice(0, 3);
  const moreSongs = musics?.slice(0, 4);
  const songToShow = currentTrack || musics?.[0];

  const handleOpenPurchaseModal = () => setIsPurchaseModalOpen(true);
  const handleClosePurchaseModal = () => setIsPurchaseModalOpen(false);

  const handleOpenAddToPlaylist = () => {
    setIsAddToPlaylistOpen(true);
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

  return (
    <MusicWrapper
      musics={moreSongs}
      playlist={true}
      trackListTitle={"More From Artist"}
    >
      <section
        className={styles.nowPlaying}
        style={{
          background: `linear-gradient(
      to right,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.5) 20%,
      rgba(0, 0, 0, 0.7) 50%,
      rgba(0, 0, 0, 0.9) 80%
    ),
    url(${songToShow.music_image}) center/cover no-repeat`,
        }}
      >
        <div className={styles.nowPlayingDetails}>
          <h4 className={styles.nowPlayingTitle}>Now Playing</h4>
          <div>
            <h1 className={styles.nowPlayingTrack}>{songToShow?.title}</h1>
            <p className={styles.nowPlayingArtist}>
              {songToShow?.artist?.name}
            </p>
          </div>
          <div className={styles.nowPlayingActions}>
            <div className={styles.tooltipWrapper}>
              <Ellipsis
                size={30}
                className={styles.icons}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              <span className={styles.tooltip}>More options</span>
            </div>

            <div className={styles.tooltipWrapper}>
              <Heart size={30} className={styles.icons} />
              <span className={styles.tooltip}>Like track</span>
            </div>

            <div className={styles.tooltipWrapper}>
              <Plus
                size={30}
                className={styles.icons}
                onClick={handleOpenAddToPlaylist}
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
          </div>
          {isMenuOpen && (
            <BlackCard className={styles.menuCard}>
              <ul>
                <li>Edit Track</li>
                <li>Remove From Sale</li>
                <li onClick={() => setIsBoostModalOpen(true)}>Boost Music</li>
                <li>Delete Track</li>
              </ul>
            </BlackCard>
          )}
          <div className={styles.purchaseContainer}>
            <div className={styles.priceTag}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.priceValue}>
                {formatPrice(songToShow.price)} IOTA
              </span>
            </div>
            <Button onClick={handleOpenPurchaseModal}>Own this track</Button>
          </div>
        </div>
        <div className={styles.nowPlayingPlayer}>
          <Player track={songToShow} />
        </div>
      </section>

      <section className={styles.recentlyPlayed}>
        <TrackList title="Recently Played" musics={recentSongs} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.featuredTitle}>Contributors</h2>
        <div className={styles.artistList}>
          {songToShow?.collaborators?.map((collaborator) => (
            <ArtistCard
              artist={collaborator}
              key={collaborator?.user_address}
            />
          ))}
        </div>
      </section>
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
      />
      <TipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
      />
      <PurchaseModal
        music={songToShow}
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        buyer={currentUser}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        music={songToShow}
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

export default Play;
