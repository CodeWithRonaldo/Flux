import styles from "./Profile.module.css";
import MusicWrapper from "../../components/MusicWrapper/MusicWrapper";
import Button from "../../components/Button/Button";
import { BlackCard } from "../../components/GlassCard/GlassCard";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "../../components/StateDisplay/StateDisplay";
import {
  Copy,
  User2,
  Wallet,
  Music,
  Play,
  Users,
  Coins,
  Plus,
  WifiOff,
} from "lucide-react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import MusicCard from "../../components/MusicCard/MusicCard";
import { useIota } from "../../hooks/useIota";
import { formatAddress } from "../../util/helper";
import { useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";

const Profile = () => {
  const { balance, address, balanceLoading, vibeTokenBalance } = useIota();
  const { disconnect, loading: isDisconnecting } = useWeb3AuthDisconnect();
  const registeredUsers = useOutletContext();
  const { musics, isPending, isError } = useFetchMusic();
  const { userInfo } = useWeb3AuthUser();

  const navigate = useNavigate();
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const {
    subscription,
    isSubscribed,
    refetch: refetchSubscription,
  } = useFetchSubscription();
  const { claimRewards, loading: isClaiming, error: claimError } = useVibetraxHook();
  const userProfile = registeredUsers?.filter((user) => user.owner === address);

 

  const userMusics = musics?.filter(
    (music) =>
      music?.artist?.user_address === address ||
      music?.current_owner?.user_address === address ||
      music?.collaborators.some(
        (collaborator) => collaborator?.user_address === address
      )
  );

  const profileLoading = balanceLoading ;

  const stats = [
    {
      icon: <Wallet size={18} absoluteStrokeWidth />,
      label: "Account Balance",
      value: `${balance} IOTA`,
    },
    {
      icon: <Coins size={18} absoluteStrokeWidth />,
      label: "Vibe Balance",
      value: `${vibeTokenBalance} VIBE`,
    },
    {
      icon: <Music size={18} absoluteStrokeWidth />,
      label: "Tracks",
      value: userMusics.length,
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

  if (!address) {
    return (
      <MusicWrapper musics={[]} showTrackList={false}>
        <ErrorState
          title="Wallet not connected"
          description="Connect your wallet to view your profile, tracks, and rewards."
        />
      </MusicWrapper>
    );
  }

  if (profileLoading) {
    return (
      <MusicWrapper musics={[]} showTrackList={false}>
        <LoadingState message="Loading your profile..." />
      </MusicWrapper>
    );
  }

  return (
    <MusicWrapper
      musics={userMusics}
      showTrackList={false}
      showPlaylistSelector={true}
    >
      <BlackCard className={styles.profileCard}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfoContainer}>
              {userInfo?.profileImage ? (
                <img
                  src={userInfo?.profileImage}
                  alt={userInfo?.name}
                  className={styles.profileImage}
                />
              ) : (
                <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
              )}
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>
                  {userProfile?.[0]?.username || userInfo?.name}
                </h1>
                <p>
                  <User2 size={16} absoluteStrokeWidth />
                  {userProfile?.[0]?.role || ""}
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
              <Button
                onClick={async () => {
                  await disconnect();
                  navigate("/");
                }}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
              </Button>
              <Button variant="btn-ghost">Edit Profile</Button>
            </div>
          </div>

          <div className={styles.bio}>
            <p>{userProfile?.[0]?.bio || ""}</p>
          </div>

          <div className={styles.statsRow}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                {stat.label.includes("Vibe") && (
                  <Plus size={18} className={styles.addStatIcon} />
                )}
              </div>
            ))}
          </div>

          {isSubscribed && subscription?.pending_vibe > 0 && (
            <div className={styles.pendingRewards}>
              <div className={styles.pendingInfo}>
                <Coins size={18} absoluteStrokeWidth />
                <span>
                  <strong>
                    {(subscription.pending_vibe / 1_000_000).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 }
                    )}{" "}
                    VIBE
                  </strong>{" "}
                  pending — earned from streaming
                </span>
              </div>
              <Button
                onClick={() =>
                  claimRewards(subscription.id).then((r) => {
                    if (r) refetchSubscription();
                  })
                }
                disabled={isClaiming}
              >
                {isClaiming ? "Claiming..." : "Claim VIBE"}
              </Button>
              {claimError && (
                <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "0.5rem", width: "100%" }}>
                  {claimError}
                </p>
              )}
            </div>
          )}
        </div>
      </BlackCard>

      <section className={styles.section}>
        <h2>Your Tracks</h2>
        {isPending ? (
          <LoadingState message="Loading your tracks..." />
        ) : userMusics?.length > 0 ? (
          <div className={styles.musicGrid}>
            {userMusics.map((music) => (
              <MusicCard key={music?.music_id} music={music} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Music size={40} />}
            title="No tracks yet"
            description="Upload your first track to get started."
          />
        )}
      </section>
    </MusicWrapper>
  );
};

export default Profile;
