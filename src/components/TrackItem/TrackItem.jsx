import { useAudio } from "../../hooks/useAudio";
import { Ellipsis, Heart, Volume2 } from "lucide-react";
import styles from "./TrackItem.module.css";

const TrackItem = ({ song, rank }) => {
  const { currentTrack, playTrack, isPlaying } = useAudio();
  const isCurrent = currentTrack?.id === song.id;
  const isActuallyPlaying = isCurrent && isPlaying;

  return (
    <div
      className={`${styles.trackItem} ${isCurrent ? styles.active : ""}`}
      onClick={() => playTrack(song)}
    >
      <div className={styles.rank}>
        {isActuallyPlaying ? (
          <Volume2 className={styles.playingIcon} size={16} />
        ) : (
          rank
        )}
      </div>
      <div className={styles.songInfo}>
        <img src={song.albumArt} alt={song.title} className={styles.albumArt} />
        <div className={styles.songDetails}>
          <div className={styles.title}>{song.title}</div>
          <div className={styles.artist}>{song.artist}</div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* <div className={styles.duration}>{song.duration}</div> */}
        <button className={styles.iconButton}>
          <Heart />
        </button>
        <button className={styles.iconButton}>
          <Ellipsis />
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
