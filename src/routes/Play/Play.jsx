import React from "react";
import styles from "./Play.module.css";
import Artist1 from "../../assets/artist11.png";
import Artist2 from "../../assets/artist12.png";
import Artist3 from "../../assets/artist13.png";
import Artist4 from "../../assets/artist14.png";
import ArtistCard from "../../components/ArtistCard/ArtistCard";

const artists = [
  {
    name: "Freed",
    genre: "Afrobeat",
    image: Artist1,
  },
  {
    name: "AbdulKuduz",
    genre: "Hip-hop",
    image: Artist2,
  },
  {
    name: "Oracle",
    genre: "Takawaka",
    image: Artist3,
  },
  {
    name: "John Doe",
    genre: "Electronic",
    image: Artist4,
  },
];
const Play = () => {
  return (
    <div className={styles.playContainer}>
      <div className={styles.leftContainer}>
        <section className={styles.featuredArtists}>
          <h2 className={styles.featuredTitle}>Featured Artist</h2>
          <div className={styles.artistList}>
            {artists.map((artist, index) => (
              <ArtistCard artist={artist} key={index} />
            ))}
          </div>
        </section>
      </div>
      <div className={styles.rightContainer}></div>
    </div>
  );
};

export default Play;
