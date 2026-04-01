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
  const audioRef = useRef(new Audio());

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

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
    const currentIndex = musics?.findIndex(
      (s) => s?.music_id === currentTrack?.music_id,
    );
    const nextIndex = (currentIndex + 1) % musics?.length;
    setCurrentTrack(musics[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack, musics]);

  const prevTrack = () => {
    const currentIndex = musics?.findIndex(
      (s) => s?.music_id === currentTrack?.music_id,
    );
    const prevIndex = (currentIndex - 1 + musics?.length) % musics?.length;
    setCurrentTrack(musics[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const updateCurrentSrc = useCallback(
    (src) => {
      if (!src) return;
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      audio.src = src;
      audio.load();
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
      nextTrack();
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrack?.preview_music) {
      const wasPlaying = isPlaying;
      audio.src = currentTrack.preview_music;
      audio.load();
      if (wasPlaying) {
        audio.play().catch((err) => console.error("Playback failed:", err));
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBottomPlayerVisible,
    setIsBottomPlayerVisible,
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
