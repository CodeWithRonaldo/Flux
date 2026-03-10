import { useAudio } from "../../hooks/useAudio";
import { Ellipsis, Heart, Volume2 } from "lucide-react";
import styles from "./TrackItem.module.css";

const TrackItem = ({ music, rank }) => {
  const { currentTrack, playTrack, isPlaying } = useAudio();
  const isCurrent = currentTrack?.id === music.music_id;
  const isActuallyPlaying = isCurrent && isPlaying;

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
          src={music.music_image}
          alt={music.title}
          className={styles.albumArt}
        />
        <div className={styles.songDetails}>
          <div className={styles.title}>{music.title}</div>
          <div className={styles.artist}>{music.artist.name}</div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* <div className={styles.duration}>{music.duration}</div> */}
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
