import {
  CircleUserRound,
  Disc3Icon,
  HomeIcon,
  Mic,
  Music,
  Radio,
  Upload,
} from "lucide-react";
import styles from "./SideBar.module.css";
import { NavLink } from "react-router-dom";

const Links = [
  { name: "Home", icon: HomeIcon, path: "/" },
  { name: "Play", icon: Disc3Icon, path: "/play" },
  { name: "Music", icon: Music, path: "/library" },
  { name: "Radio", icon: Radio, path: "/radio" },
  { name: "Mic", icon: Mic, path: "/mic" },
  { name: "Upload", icon: Upload, path: "/upload" },
  { name: "Profile", icon: CircleUserRound, path: "/profile" },
];

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <div>
        {Links.map((link) => (
          <li key={link.name}>
            <NavLink to={link.path}>
              <link.icon className={styles.icon} />
            </NavLink>
          </li>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
