import React from "react";
import styles from "./BottomPlayer.module.css";
import { useAudio } from "../../hooks/useAudio";
import { Play, Pause, SkipForward, SkipBack, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BottomPlayer = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    setIsBottomPlayerVisible,
  } = useAudio();

  if (!currentTrack) return null;

  const handleContainerClick = () => {
    navigate(`/play/${currentTrack.id}`);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      togglePlay();
    }
    setIsBottomPlayerVisible(false);
  };

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    togglePlay();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    nextTrack();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    prevTrack();
  };

  return (
    <div className={styles.bottomPlayer} onClick={handleContainerClick}>
      <div className={styles.left}>
        <img
          src={currentTrack.albumArt}
          alt={currentTrack.title}
          className={styles.albumArt}
        />
        <div className={styles.trackInfo}>
          <p className={styles.title}>{currentTrack.title}</p>
          <p className={styles.artist}>{currentTrack.artist}</p>
        </div>
      </div>

      <div className={styles.center}>
        <button className={styles.controlBtn} onClick={handlePrev}>
          <SkipBack size={24} fill="currentColor" />
        </button>
        <button className={styles.controlBtn} onClick={handlePlayToggle}>
          {isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" />
          )}
        </button>
        <button className={styles.controlBtn} onClick={handleNext}>
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default BottomPlayer;
