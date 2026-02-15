import styles from "./TrackList.module.css";
import TrackItem from "../TrackItem/TrackItem";
import SearchBar from "../SearchBar/SearchBar";

const TrackList = ({ title, songs, hasSearch = false }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {hasSearch && <SearchBar className={styles.searchBar} />}

      <div className={styles.songList}>
        {songs?.map((song, index) => (
          <TrackItem key={song.id} song={song} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default TrackList;
