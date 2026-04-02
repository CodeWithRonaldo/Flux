import { useState, useRef, useEffect, useCallback } from "react";
import { AudioContext } from "./AudioContext";
import { useFetchMusic } from "../hooks/useFetchMusic";

export const AudioProvider = ({ children }) => {
  const { musics } = useFetchMusic();
  const [currentTrack, setCurrentTrack] = useState(musics[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBottomPlayerVisible, setIsBottomPlayerVisible] = useState(false);

  // New States for repeat and shuffle
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef(new Audio());

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const playTrack = useCallback(
    (music) => {
      if (currentTrack?.music_id === music?.music_id) {
        togglePlay();
      } else {
        setCurrentTrack(music);
        setIsPlaying(true);
        setIsBottomPlayerVisible(true);
      }
    },
    [currentTrack, togglePlay],
  );

  const nextTrack = useCallback(() => {
    if (!musics || musics.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * musics.length);
      setCurrentTrack(musics[randomIndex]);
    } else {
      const currentIndex = musics.findIndex(
        (s) => s?.music_id === currentTrack?.music_id,
      );
      const nextIndex = (currentIndex + 1) % musics.length;
      setCurrentTrack(musics[nextIndex]);
    }
    setIsPlaying(true);
  }, [currentTrack, musics, isShuffle]);

  const prevTrack = useCallback(() => {
    if (!musics || musics.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * musics.length);
      setCurrentTrack(musics[randomIndex]);
    } else {
      const currentIndex = musics.findIndex(
        (s) => s?.music_id === currentTrack?.music_id,
      );
      const prevIndex = (currentIndex - 1 + musics.length) % musics.length;
      setCurrentTrack(musics[prevIndex]);
    }
    setIsPlaying(true);
  }, [currentTrack, musics, isShuffle]);

  const seek = (time) => {
    if (!isNaN(time) && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const updateCurrentSrc = useCallback(
    (src) => {
      if (!src) return;
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      if (audio.src !== src) {
        audio.src = src;
        audio.load();
      }
      if (wasPlaying) {
        audio.play().catch((err) => console.error("Playback failed:", err));
      }
    },
    [isPlaying],
  );

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error("Playback failed:", err));
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextTrack, isRepeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrack?.preview_music) {
      if (audio.src !== currentTrack.preview_music) {
        audio.src = currentTrack.preview_music;
        audio.load();
      }

      if (isPlaying) {
        audio.play().catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  // Remove the duplicate isPlaying useEffect since we handle it in the dependencies above

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBottomPlayerVisible,
    setIsBottomPlayerVisible,
    isRepeat,
    isShuffle,
    toggleRepeat,
    toggleShuffle,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    updateCurrentSrc,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
