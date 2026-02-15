
import { useState } from 'react';
import styles from './TrackList.module.css';
import TrackItem from '../TrackItem/TrackItem';
import SearchBar from '../SearchBar/SearchBar';

const TrackList = ({ title, badge, songs, initialShow = 5, hasSearch=false }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedSongs = showAll ? songs : songs?.slice(0, initialShow);

  const handleLike = (songId) => {
    console.log('Liked song:', songId);
    
  };

  const handleMore = (songId) => {
    console.log('More options for:', songId);
    
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {badge && (
          <div className={styles.badges}>
            {badge.map((b, index) => (
              <span key={index} className={styles.badge}>
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {
        hasSearch && (
          <SearchBar className={styles.searchBar}/>
        )
      }

      <div className={styles.songList}>
        {displayedSongs?.map((song, index) => (
          <TrackItem
            key={song.id}
            rank={index + 1}
            albumArt={song.albumArt}
            title={song.title}
            artist={song.artist}
            duration={song.duration}
            onLike={() => handleLike(song.id)}
            onMore={() => handleMore(song.id)}
          />
        ))}
      </div>

      {songs?.length > initialShow && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className={styles.expandButton}
        >
          {showAll ? 'Show Less ˄' : 'Expand ˅'}
        </button>
      )}
    </div>
  );
}

export default TrackList;