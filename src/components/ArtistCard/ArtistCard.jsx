import React from "react";
import styles from "./ArtistCard.module.css";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const ArtistCard = ({ artist }) => {
  return (
    <div className={styles.artistCard}>
      <Jazzicon
        diameter={100}
        seed={jsNumberForAddress(artist?.user_address || "0x6")}
      />
      {/* <div className={styles.imageContainer}>
        <img src={artist?.image} alt={artist?.name} />
      </div> */}
      <div className={styles.infoContainer}>
        <h3>{artist?.username}</h3>
        <p>{artist?.role}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
