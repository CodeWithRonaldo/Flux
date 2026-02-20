import { createContext } from "react";


export const PlayListContext = createContext({
    playlists: [],
    currentPlaylist: null,
    createPlaylist: (name) => {},
    deletePlaylist: (id) => {},
    RenamePlaylist: (id, newName) => {},
    addSongToPlaylist: (playlistId, track) => {},
    removeSongFromPlaylist: (playlistId, trackId) => {},
    setCurrentPlaylist: (playlist) => {},
})