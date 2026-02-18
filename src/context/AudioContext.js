import { createContext } from "react";

export const AudioContext = createContext({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  seek: () => {},
});
