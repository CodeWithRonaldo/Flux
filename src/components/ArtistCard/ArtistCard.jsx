import React from "react";
import styles from "./ArtistCard.module.css";

const ArtistCard = ({ artist }) => {
  return (
    <div className={styles.artistCard}>
      <div className={styles.imageContainer}>
        <img src={artist.image} alt={artist.name} />
      </div>
      <div className={styles.infoContainer}>
        <h3>{artist.name}</h3>
        <p>{artist.genre}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
