import React, { useState, useEffect } from "react";
import styles from "./Play.module.css";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Button from "../../components/Button/Button";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import { BanknoteArrowUp, Ellipsis, Heart, Menu, Plus } from "lucide-react";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
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
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { formatPrice } from "../../util/helper";
import { useIota } from "../../hooks/useIota";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { useFetchLikes } from "../../hooks/useFetchLikes";

const Play = () => {
  const { id } = useParams();
  const registeredUsers = useOutletContext();
  const navigate = useNavigate();
  const { currentTrack, playTrack, updateCurrentSrc } = useAudio();
  const { createPlaylist, setCurrentPlaylist } = usePlaylist();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { musics, isPending } = useFetchMusic();
  const { address } = useIota();
  const { isSubscribed } = useFetchSubscription();
  const { likeMusic, toggleSale, deleteMusic } = useVibetraxHook();
  const { liked, isLikeLoading } = useFetchLikes();
  const { userInfo } = useWeb3AuthUser();

  const currentUser = registeredUsers?.filter((user) => user.owner === address);

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

  const hasLiked =
    liked
      ?.filter((like) => like.music_id === songToShow?.music_id)
      .map((like) => like.music_id) || [];

  const handleLike = async () => {
    if (!songToShow || !address || isLiking || hasLiked.length > 0) return;

   
    const name = currentUser?.[0]?.username || userInfo?.name;
    const role = currentUser?.[0]?.role || "listener";

    setIsLiking(true);
    const result = await likeMusic({
      musicId: songToShow.music_id,
      likerName: name,
      likerRole: role,
    });
    setIsLiking(false);

    if (!result?.digest) {
      console.error("Failed to like music");
      return;
    }
    console.log("Liked music successfully:", result);
  };

  const forSale = songToShow?.for_sale === true;

  const isPremium =
    address === songToShow?.current_owner?.user_address ||
    address === songToShow?.artist?.user_address ||
    songToShow?.collaborators.some(
      (collaborator) => collaborator.user_address === address,
    );

  const showEditButton =
    songToShow?.current_owner?.user_address ===
      songToShow?.artist?.user_address &&
    songToShow?.current_owner?.user_address === address;

  // Upgrade audio src to full quality when access is confirmed
  useEffect(() => {
    if (!songToShow) return;
    const src =
      isPremium || isSubscribed
        ? songToShow.full_music
        : songToShow.preview_music;
    updateCurrentSrc(src);
  }, [isPremium, isSubscribed, songToShow?.music_id]);

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
      isPending={isPending}
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
    url(${songToShow?.music_image}) center/cover no-repeat`,
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
                className={`${styles.icons} ${isLiking ? styles.likeLoading : ""}`}
                fill={hasLiked.length > 0 ? "currentColor" : "none"}
                style={{
                  cursor: hasLiked.length > 0 ? "default" : "pointer",
                }}
              />
              <span className={styles.tooltip}>{songToShow?.likes} likes</span>
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
                <li
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/upload/${songToShow?.music_id}`);
                  }}
                >
                  Edit Track
                </li>
                <li
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await toggleSale(songToShow?.music_id);
                  }}
                >
                  {songToShow?.for_sale ? "Remove From Sale" : "Put on Sale"}
                </li>
                <li
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsBoostModalOpen(true);
                  }}
                >
                  Boost Music
                </li>
                <li
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Delete this track? This cannot be undone.",
                      )
                    )
                      return;
                    setIsMenuOpen(false);
                    const result = await deleteMusic(songToShow?.music_id);
                    if (result) navigate("/");
                  }}
                >
                  Delete Track
                </li>
              </ul>
            </BlackCard>
          )}
          <div className={styles.purchaseContainer}>
            <div className={styles.priceTag}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.priceValue}>
                {formatPrice(songToShow?.price)} IOTA
              </span>
            </div>
            {forSale && !isPremium && (
              <Button onClick={handleOpenPurchaseModal}>Own this track</Button>
            )}
          </div>
        </div>
        <div className={styles.nowPlayingPlayer}>
          <Player track={songToShow} />
        </div>
      </section>

      <section className={styles.recentlyPlayed}>
        <TrackList
          title="Recently Played"
          musics={recentSongs}
          isPending={isPending}
        />
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
        music={songToShow}
      />
      <TipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        music={songToShow}
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
