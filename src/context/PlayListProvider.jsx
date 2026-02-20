import { useState, useEffect } from "react";
import { PlayListContext } from "./PlayListContext";

const PlayListProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState("top100");

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      const defaultPlaylist = [
        {
          id: "favorites",
          name: "My Favorites",
          songs: [],
        },
      ];
      setPlaylists(defaultPlaylist);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
  }, [playlists]);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (currentPlaylist === playlistId) {
      setCurrentPlaylist("top100");
    }
  };

  const renamePlaylist = (playlistId, newName) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p)),
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          if (p.songs.find((s) => s.id === song.id)) {
            return p;
          }
          return { ...p, songs: [...p.songs, song] };
        }
        return p;
      }),
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p,
      ),
    );
  };

  const value = {
    playlists,
    currentPlaylist,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    setCurrentPlaylist,
  };

  return (
    <PlayListContext.Provider value={value}>
      {children}
    </PlayListContext.Provider>
  );
};

export default PlayListProvider;
