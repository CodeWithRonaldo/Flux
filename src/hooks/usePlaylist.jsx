import { useContext } from "react";
import { PlayListContext } from "../context/PlayListContext";

export const usePlaylist = () => {
  const context = useContext(PlayListContext);

  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }

  return context;
};
