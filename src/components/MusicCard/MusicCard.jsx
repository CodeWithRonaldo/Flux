import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import styles from "./MusicCard.module.css";
import { useIota } from "../../hooks/useIota";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";

const MusicCard = ({ music }) => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { address } = useIota();
  const { isSubscribed } = useFetchSubscription();

  const isCurrent = currentTrack?.id === music.music_id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const isPremium =
    address === music?.current_owner?.user_address ||
    address === music?.artist?.user_address ||
    music?.collaborators.some(
      (collaborator) => collaborator.user_address === address,
    ) ||
    isSubscribed;
  const trackType = isPremium ? "premium" : "standard";

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
