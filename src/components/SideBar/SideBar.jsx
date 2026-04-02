import { useNavigate, NavLink } from "react-router-dom";
import {
  CircleUserRound,
  HomeIcon,
  Mic,
  Music,
  Radio,
  Search,
  Upload,
  Crown,
} from "lucide-react";
import styles from "./SideBar.module.css";

import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useSearch } from "../../hooks/useSearch";
import useFetchUsers from "../../hooks/useFetchUsers";

const Links = [
  { name: "Home", icon: HomeIcon, path: "/" },
  { name: "Music", icon: Music, path: "/library" },
  // { name: "Radio", icon: Radio, path: "/radio" },
  // { name: "Mic", icon: Mic, path: "/mic" },
  { name: "Upload", icon: Upload, path: "/upload" },
  { name: "Profile", icon: CircleUserRound, path: "/profile" },
];

const SideBar = () => {
  const { currentUser } = useFetchUsers();
  const hasRegistered = !!currentUser;
  const canUpload =
    hasRegistered && currentUser.role.toLowerCase() === "artist";
  const { setIsSearchOpen } = useSearch();
  const { isSubscribed } = useFetchSubscription();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (window.innerWidth <= 768) navigate("/search");
    else setIsSearchOpen(true);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <li>
          <button className={styles.searchBtn} onClick={handleSearchClick}>
            <Search className={styles.icon} />
          </button>
        </li>
        {Links.map((link) => {
          if (link.name === "Upload" && !canUpload) return null;
          if (link.name === "Profile" && !hasRegistered) return null;
          return (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                {link.name === "Profile" ? (
                  <div className={styles.profileIconWrapper}>
                    <link.icon
                      className={
                        isSubscribed
                          ? `${styles.icon} ${styles.premiumIcon}`
                          : styles.icon
                      }
                    />
                    {isSubscribed && (
                      <Crown size={12} className={styles.premiumBadge} />
                    )}
                  </div>
                ) : (
                  <link.icon className={styles.icon} />
                )}
              </NavLink>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
