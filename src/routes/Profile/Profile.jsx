import React from "react";
import styles from "./Profile.module.css";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs } from "../../util/songList";
import Button from "../../components/Button/Button";
import { BlackCard, GlassCard } from "../../components/GlassCard/GlassCard";
import { Copy, Upload, User2, Wallet } from "lucide-react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
  return (
    <MusicWrapper songs={songs}>
      <BlackCard className={styles.profileCard}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfoContainer}>
              <Jazzicon
                diameter={100}
                seed={jsNumberForAddress("0x1234...5678")}
              />
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>John Doe</h1>
                <p>
                  <User2 size={24} absoluteStrokeWidth />
                  Artist
                </p>
                <p>
                  <Wallet size={24} absoluteStrokeWidth />
                  0x1234...5678
                  <Copy
                    size={18}
                    absoluteStrokeWidth
                    className={styles.copyIcon}
                  />
                  <p>Move Balance: 10</p>
                </p>
              </div>
            </div>

            <div className={styles.profileActions}>
              <Button>Connect Wallet</Button>
              <Button variant="btn-ghost">Edit Profile</Button>
            </div>
          </div>
          <div className={styles.uploadBtnContainer}>
            <Button onClick={() => navigate("/upload")}>
              <Upload size={24} /> Upload Track
            </Button>
          </div>
        </div>
      </BlackCard>

      <BlackCard>
        <div className={styles.tracksContainer}>
          <h2 className={styles.sectionTitle}>Your Tracks</h2>
          <p className={styles.noTracks}>
            You haven't uploaded any tracks yet.
          </p>
        </div>
        {/* {isArtist ? (
          <div>
            <h3>Tracks</h3>
            <h3>Likes</h3>
          </div>
        ) : (
          <div>
            <h3>Liked Tracks</h3>
          </div>
        )} */}
      </BlackCard>

      {songs.length > 0 && (
        <BlackCard className={styles.tracksContainer}>
          <h2 className={styles.sectionTitle}>Your Tracks</h2>
          {songs.map((song, index) => (
            <div key={index} className={styles.trackCard}>
              <div className={styles.trackInfo}>
                <div>
                  {index + 1}
                  <img src={song.albumArt} alt={song.title} />
                </div>
              </div>
              <div>
                <h3>{song.title}</h3>
                <h3>{song.artist}</h3>
              </div>
            </div>
          ))}
        </BlackCard>
      )}
    </MusicWrapper>
  );
};

export default Profile;
