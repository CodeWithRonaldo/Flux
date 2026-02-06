import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            THE MULTI UNIVERSAL <br /> MUSIC PLAYLIST
          </h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            laboriosam vitae aut illum? Iusto accusantium eveniet ullam modi,
            obcaecati tenetur voluptatem eius voluptates, ducimus repellendus
            illo, repellat amet ipsam ad!
          </p>
        </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p>Left Card</p>
          </div>
          <div className={styles.card}>
            <p>Right Card</p>
          </div>
        </div>
      </div>
    </div>
};

export default Home;
