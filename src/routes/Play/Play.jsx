import React, { useState, useEffect } from "react";
import styles from "./Play.module.css";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Button from "../../components/Button/Button";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import { BanknoteArrowUp, Ellipsis, Heart, Menu, Plus } from "lucide-react";

import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs, artists } from "../../util/songList";
import MusicCard from "../../components/MusicCard/MusicCard";
import PurchaseModal from "../../components/PurchaseModal/PurchaseModal";

import { useParams, useNavigate } from "react-router-dom";
import { useAudio } from "../../hooks/useAudio";
import { BlackCard } from "../../components/GlassCard/GlassCard";

const Play = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrack, playTrack } = useAudio();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync context with URL param on mount or URL change
  useEffect(() => {
    if (id && currentTrack?.id !== parseInt(id)) {
      const songToPlay = songs.find((s) => s.id === parseInt(id));
      if (songToPlay) {
        playTrack(songToPlay);
      }
    }
  }, [id]);

  // Sync URL with context change (e.g. via Next/Prev buttons)
  useEffect(() => {
    if (currentTrack && id && currentTrack.id !== parseInt(id)) {
      navigate(`/play/${currentTrack.id}`, { replace: true });
    }
  }, [currentTrack, id, navigate]);

  const recentSongs = songs.slice(0, 3);
  const songToShow = currentTrack || songs[0];

  const handleOpenPurchaseModal = () => setIsPurchaseModalOpen(true);
  const handleClosePurchaseModal = () => setIsPurchaseModalOpen(false);

  return (
    <MusicWrapper songs={songs} playlist={true}>
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
    url(${songToShow.albumArt}) center/cover no-repeat`,
        }}
      >
        <div className={styles.nowPlayingDetails}>
          <h4 className={styles.nowPlayingTitle}>Now Playing</h4>
          <div>
            <h1 className={styles.nowPlayingTrack}>{songToShow.title}</h1>
            <p className={styles.nowPlayingArtist}>{songToShow.artist}</p>
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
              <Plus size={30} className={styles.icons} />
              <span className={styles.tooltip}>Add to playlist</span>
            </div>

            <div className={styles.tooltipWrapper}>
              <BanknoteArrowUp size={30} className={styles.icons} />
              <span className={styles.tooltip}>Boost music</span>
            </div>
          </div>
          {isMenuOpen && (
            <BlackCard className={styles.menuCard}>
              <ul>
                <li>Edit Track</li>
                <li>Remove From Sale</li>
                <li>Boost Music</li>
                <li>Delete Track</li>
              </ul>
            </BlackCard>
          )}
          <div className={styles.purchaseContainer}>
            <div className={styles.priceTag}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.priceValue}>{songToShow.price} IOTA</span>
            </div>
            <Button onClick={handleOpenPurchaseModal}>Own this track</Button>
          </div>
        </div>
        <div className={styles.nowPlayingPlayer}>
          <Player track={songToShow} />
        </div>
      </section>

      <section className={styles.recentlyPlayed}>
        <TrackList title="Recently Played" songs={recentSongs} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.featuredTitle}>Contributors</h2>
        <div className={styles.artistList}>
          {artists.map((artist, index) => (
            <ArtistCard artist={artist} key={index} />
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>More from Artist</h2>
        <div className={styles.musicGrid}>
          {songs.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <PurchaseModal
        track={songToShow}
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
      />
    </MusicWrapper>
  );
};

export default Play;
