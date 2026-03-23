import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import styles from "./MusicCard.module.css";

const MusicCard = ({ music }) => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isCurrent = currentTrack?.id === music.music_id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const trackType = "premium";

  const handleCardClick = () => {
    if (!isCurrent) {
      playTrack(music);
    }
    navigate(`/play/${music.music_id}`);
  };

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(music);
    }
  };

  return (
    <div className={styles.musicCard} onClick={handleCardClick}>
      <div
        className={styles.imageContainer}
        style={{
          backgroundImage: `url(${music.music_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
            trackType === "premium" ? styles.premiumBadge : ""
          }`}
        >
          {trackType}
        </div>
      </div>

      <div className={styles.musicDetails}>
        <h3 className={styles.musicTitle}>{music.title}</h3>
        <p className={styles.musicArtist}>{music.artist.name}</p>
      </div>
    </div>
  );
};

export default MusicCard;
