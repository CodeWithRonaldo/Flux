import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import styles from "./MusicCard.module.css";

const MusicCard = ({ track }) => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingCurrent = isCurrent && isPlaying;

  const handleCardClick = () => {
    if (!isCurrent) {
      playTrack(track);
    }
    navigate(`/play/${track.id}`);
  };

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className={styles.musicCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={track.albumArt}
          alt={track.title}
          className={styles.musicImg}
        />

        <div className={styles.playOverlay}>
          <button className={styles.playIconBtn} onClick={handlePlayToggle}>
            {isPlayingCurrent ? (
              <Pause fill="currentColor" size={20} />
            ) : (
              <Play fill="currentColor" size={20} />
            )}
          </button>
        </div>

        <div
          className={`${styles.qualityBadge} ${
            track.type === "premium" ? styles.premiumBadge : ""
          }`}
        >
          {track.type}
        </div>
      </div>

      <div className={styles.musicDetails}>
        <h3 className={styles.musicTitle}>{track.title}</h3>
        <p className={styles.musicArtist}>{track.artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;
