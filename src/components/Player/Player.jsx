import { useAudio } from "../../hooks/useAudio";
import { useRef } from "react";
import styles from "./Player.module.css";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";

const Player = ({ track, className }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
  } = useAudio();

  const isCurrent = track ? currentTrack?.id === track.id : true;
  const isPlayingCurrent = isCurrent && isPlaying;

  // Use track's duration if not current, otherwise global duration
  const displayDuration = isCurrent ? duration : track?.duration || 0;
  const displayCurrentTime = isCurrent ? currentTime : 0;

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    if (typeof time === "string") return time;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const currentProgress =
    isCurrent && displayDuration
      ? (displayCurrentTime / displayDuration) * 100
      : 0;
  const totalBars = 35;

  const getHeartHeight = (i) => {
    const x = (i / (totalBars - 1)) * 2 - 1;
    const absX = Math.abs(x);
    // Classic heart curve thickness formula: sqrt(1-x^2) + |x|^(2/3)
    const h = (Math.sqrt(1 - x * x) + Math.pow(absX, 0.6)) * 40;
    return Math.max(15, h);
  };

  const visualizerRef = useRef(null);

  const handleSeek = (e) => {
    if (!isCurrent || !displayDuration || !visualizerRef.current) return;
    const rect = visualizerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * displayDuration;
    seek(seekTime);
  };

  return (
    <div className={`${styles.playerContainer} ${className}`}>
      <div className={styles.progressSection}>
        <div
          className={styles.visualizer}
          ref={visualizerRef}
          onClick={handleSeek}
          style={{ cursor: isCurrent ? "pointer" : "default" }}
        >
          {[...Array(totalBars)].map((_, i) => {
            const barProgress = (i / totalBars) * 100;
            const isFilled = currentProgress >= barProgress;
            const h = getHeartHeight(i);
            return (
              <div
                key={i}
                className={`${styles.bar} ${isFilled ? styles.filled : ""}`}
                style={{
                  height: `${h}%`,
                  "--index": i,
                }}
              ></div>
            );
          })}
        </div>
        <div className={styles.timeInfo}>
          <span>{formatTime(displayCurrentTime)}</span>
          <span>{formatTime(displayDuration)}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.iconBtn}>
          <Shuffle size={20} />
        </button>
        <button className={styles.iconBtn} onClick={prevTrack}>
          <SkipBack size={24} fill="currentColor" />
        </button>
        <button
          className={styles.playBtn}
          onClick={(e) => {
            e.stopPropagation();
            if (isCurrent) {
              togglePlay();
            } else {
              playTrack(track);
            }
          }}
        >
          {isPlayingCurrent ? (
            <Pause size={32} fill="black" color="black" />
          ) : (
            <Play size={32} fill="black" color="black" />
          )}
        </button>
        <button className={styles.iconBtn} onClick={nextTrack}>
          <SkipForward size={24} fill="currentColor" />
        </button>
        <button className={styles.iconBtn}>
          <Repeat size={20} />
        </button>
      </div>
    </div>
  );
};

export default Player;
