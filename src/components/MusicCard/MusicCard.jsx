import styles from "./MusicCard.module.css";

const MusicCard = ({ track }) => {
  return (
    <div to={`/${track.id}`} className={styles.musicCard}>
      <div className={styles.imageContainer}>
        <img
          src={track.albumArt}
          alt={track.title}
          className={styles.musicImg}
        />

        <div
          className={`${styles.qualityBadge} ${
            track.type === "premium" ? styles.premiumBadge : ""
          }`}
        >
          {track.type}
        </div>
      </div>

      <div className={styles.musicDetails}>
        <h3 className={styles.musicTitle}>{track.title}</h3>
        <p className={styles.musicArtist}>{track.artist}</p>
        <div className={styles.musicMeta}>
          {/* <span>{track.duration}</span>
          <span>•</span>
          <span>{track.like_count || 0} likes</span>
          <span>•</span>
          <span>{track.streaming_count || 0} plays</span> */}
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
