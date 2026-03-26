import { useState } from "react";
import { useAudio } from "../../hooks/useAudio";
import { Ellipsis, Heart, Volume2 } from "lucide-react";
import styles from "./TrackItem.module.css";
import { useIota } from "../../hooks/useIota";
import { useFetchLikes } from "../../hooks/useFetchLikes";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import { useOutletContext, useNavigate } from "react-router-dom";
import { BlackCard } from "../GlassCard/GlassCard";
import BoostModal from "../BoostModal/BoostModal";

const TrackItem = ({ music, rank }) => {
  const { currentTrack, playTrack, isPlaying } = useAudio();
  const isCurrent = currentTrack?.music_id === music?.music_id;
  const isActuallyPlaying = isCurrent && isPlaying;

  const { address } = useIota();
  const registeredUsers = useOutletContext();
  const navigate = useNavigate();
  const { liked } = useFetchLikes();
  const { likeMusic, toggleSale, deleteMusic, error: actionError } = useVibetraxHook();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

  const currentUser = registeredUsers?.filter((user) => user.owner === address);

  const hasLiked =
    liked?.filter((like) => like.music_id === music?.music_id).map((like) => like.music_id) || [];

  const showEditButton =
    music?.current_owner?.user_address === music?.artist?.user_address &&
    music?.current_owner?.user_address === address;

  const handleLike = async () => {
    if (!music || !address || isLiking || hasLiked.length > 0) return;

    const name = currentUser?.[0]?.username;
    const role = currentUser?.[0]?.role || "listener";

    setIsLiking(true);
    const result = await likeMusic({
      musicId: music.music_id,
      likerName: name,
      likerRole: role,
    });
    setIsLiking(false);

    if (!result?.digest) {
      console.error("Failed to like music");
    }
  };

  return (
    <div className={`${styles.trackItem} ${isCurrent ? styles.active : ""}`}>
      <div className={styles.rank}>
        {isActuallyPlaying ? (
          <Volume2 className={styles.playingIcon} size={16} />
        ) : (
          rank
        )}
      </div>
      <div className={styles.songInfo} onClick={() => playTrack(music)}>
        <img
          src={music?.music_image}
          alt={music?.title}
          className={styles.albumArt}
        />
        <div className={styles.songDetails}>
          <div className={styles.title}>{music?.title}</div>
          <div className={styles.artist}>{music?.artist?.name}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.iconButton} ${isLiking ? styles.likeLoading : ""}`}
          onClick={handleLike}
          style={{ cursor: hasLiked.length > 0 ? "default" : "pointer" }}
        >
          <Heart size={18} fill={hasLiked.length > 0 ? "currentColor" : "none"} />
        </button>

        {showEditButton && (
          <div style={{ position: "relative" }}>
            <button
              className={styles.iconButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Ellipsis size={18} />
            </button>
            {isMenuOpen && (
              <BlackCard className={styles.menuCard}>
                <ul>
                  <li
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/upload/${music?.music_id}`);
                    }}
                  >
                    Edit Track
                  </li>
                  <li
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await toggleSale(music?.music_id);
                    }}
                  >
                    {music?.for_sale ? "Remove From Sale" : "Put on Sale"}
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
                      if (!window.confirm("Delete this track? This cannot be undone.")) return;
                      setIsMenuOpen(false);
                      const result = await deleteMusic(music?.music_id);
                      if (result) navigate("/");
                    }}
                  >
                    Delete Track
                  </li>
                </ul>
              </BlackCard>
            )}
          </div>
        )}
      </div>

      {actionError && (
        <p className={styles.actionError}>{actionError}</p>
      )}

      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        music={music}
      />
    </div>
  );
};

export default TrackItem;
