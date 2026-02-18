import { useState, useRef, useEffect } from "react";
import { songs } from "../util/songList";
import { AudioContext } from "./AudioContext";

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBottomPlayerVisible, setIsBottomPlayerVisible] = useState(false);
  const audioRef = useRef(new Audio());

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
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrack?.audio) {
      const wasPlaying = isPlaying;
      audio.src = currentTrack.audio;
      audio.load();
      if (wasPlaying) {
        audio.play().catch((err) => console.error("Playback failed:", err));
      }
    }
  }, [currentTrack]);

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

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsBottomPlayerVisible(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentTrack(songs[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentTrack(songs[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

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
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
