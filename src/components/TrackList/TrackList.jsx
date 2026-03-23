import styles from "./TrackList.module.css";
import TrackItem from "../TrackItem/TrackItem";
import SearchBar from "../SearchBar/SearchBar";
import { BlackCard } from "../GlassCard/GlassCard";
import { LoadingState, EmptyState } from "../StateDisplay/StateDisplay";
import { Music } from "lucide-react";

const TrackList = ({ title, musics, hasSearch = false, isPending = false }) => {
  return (
    <BlackCard className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {hasSearch && <SearchBar className={styles.searchBar} />}

      {isPending ? (
        <LoadingState message="Loading tracks..." />
      ) : !musics?.length ? (
        <EmptyState icon={<Music size={32} />} title="No tracks" />
      ) : (
        <div className={styles.songList}>
          {musics.map((music, index) => (
            <TrackItem key={music.music_id} music={music} rank={index + 1} />
          ))}
        </div>
      )}
    </BlackCard>
  );
};

export default TrackList;
