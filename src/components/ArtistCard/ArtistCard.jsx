import React from "react";
import styles from "./ArtistCard.module.css";
// import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const ArtistCard = ({ artist }) => {
  // console.log("Artist Image URL:", artist?.image_url);
  return (
    <div className={styles.artistCard}>
      {/* <Jazzicon
        diameter={100}
        seed={jsNumberForAddress(artist?.owner || "0x6")}
      /> */}
      <div className={styles.imageContainer}>
        <img
          src={artist?.image_url}
          alt={artist?.name}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className={styles.infoContainer}>
        <h3>{artist?.username}</h3>
        <p>{artist?.role}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
