import React from "react";
import styles from "./Play.module.css";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Player from "../../assets/player.png";
import Button from "../../components/Button/Button";
import TrackList from "../../components/TrackList/TrackList";
import { Ellipsis, Heart, Menu, Plus } from "lucide-react";

import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs, artists } from "../../util/songList";
import { BlackCard } from "../../components/GlassCard/GlassCard";

const Play = () => {
  const recentSongs = songs.slice(0, 3);
  return (
    <MusicWrapper songs={songs} playlist={true}>
      <div className={styles.nowPlaying}>
        <div className={styles.nowPlayingDetails}>
          <h4 className={styles.nowPlayingTitle}>Now Playing</h4>
          <div>
            <h1 className={styles.nowPlayingTrack}>The girl in lemonade</h1>
            <p className={styles.nowPlayingArtist}>Freed ft AbdulKuduz</p>
          </div>
          <div className={styles.nowPlayingActions}>
            <Ellipsis size={30} className={styles.icons} />
            <Heart size={30} className={styles.icons} />
            <Plus size={30} className={styles.icons} />
          </div>
        </div>
        <div className={styles.nowPlayingPlayer}>
          <img src={Player} alt="player" />
        </div>
      </div>
      <section className={styles.recentlyPlayed}>
        <BlackCard>
          <TrackList title="Recently Played" songs={recentSongs} />
        </BlackCard>
      </section>
      <section className={styles.featuredArtists}>
        <h2 className={styles.featuredTitle}>Featured Artist</h2>
        <div className={styles.artistList}>
          {artists.map((artist, index) => (
            <ArtistCard artist={artist} key={index} />
          ))}
        </div>
      </section>
    </MusicWrapper>
  );
};

export default Play;
