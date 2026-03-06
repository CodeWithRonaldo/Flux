import styles from "./Profile.module.css";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import { songs } from "../../util/songList";
import Button from "../../components/Button/Button";
import { BlackCard } from "../../components/GlassCard/GlassCard";
import {
  Copy,
  User2,
  Wallet,
  Music,
  Play,
  Users,
  Coins,
  Plus,
} from "lucide-react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import MusicCard from "../../components/MusicCard/MusicCard";
import { useEffect } from "react";
import { useIota } from "../../hooks/useIota";
import { formatAddress } from "../../util/helper";
import { useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const { balance, address } = useIota();
  const { disconnect } = useWeb3AuthDisconnect();
  const registeredUser = useOutletContext();

  const stats = [
    {
      icon: <Wallet size={18} absoluteStrokeWidth />,
      label: "Account Balance",
      value: `${balance} IOTA`,
    },
    {
      icon: <Coins size={18} absoluteStrokeWidth />,
      label: "Flux Balance",
      value: "1,240 FLX",
    },
    {
      icon: <Music size={18} absoluteStrokeWidth />,
      label: "Tracks",
      value: songs.length,
    },
    {
      icon: <Play size={18} absoluteStrokeWidth />,
      label: "Total Streams",
      value: "48.2K",
    },
    {
      icon: <Users size={18} absoluteStrokeWidth />,
      label: "Followers",
      value: "3.1K",
    },
  ];

  const handleCopy = () => {
    if (!address) return;
    try {
      navigator.clipboard.writeText(address);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <MusicWrapper
      songs={songs}
      showTrackList={false}
      showPlaylistSelector={true}
    >
      <BlackCard className={styles.profileCard}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfoContainer}>
              <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>
                  {registeredUser[0]?.username || "Vibe User"}
                </h1>
                <p>
                  <User2 size={16} absoluteStrokeWidth />
                  {registeredUser[0]?.role}
                </p>
                <p className={styles.walletRow}>
                  <Wallet size={16} absoluteStrokeWidth />
                  <span className={styles.walletAddress}>
                    {formatAddress(address)}
                  </span>
                  <Copy
                    size={14}
                    absoluteStrokeWidth
                    className={styles.copyIcon}
                    onClick={handleCopy}
                  />
                </p>
              </div>
            </div>

            <div className={styles.profileActions}>
              <Button onClick={disconnect}>Disconnect Wallet</Button>
              <Button variant="btn-ghost">Edit Profile</Button>
            </div>
          </div>

          <div className={styles.bio}>
            <p>{registeredUser[0]?.bio}</p>
          </div>

          <div className={styles.statsRow}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                {stat.label.includes("Flux") && (
                  <Plus size={18} className={styles.addStatIcon} />
                )}
              </div>
            ))}
          </div>
        </div>
      </BlackCard>

      <section className={styles.section}>
        <h2>Your Tracks</h2>
        {songs.length > 0 && (
          <div className={styles.musicGrid}>
            {songs.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>
    </MusicWrapper>
  );
};

export default Profile;
