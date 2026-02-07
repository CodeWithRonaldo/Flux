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

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <HomeIcon className={styles.icon} />
        </li>
        <li>
          <Disc3Icon className={styles.icon} />
        </li>
        <li>
          <Music className={styles.icon} />
        </li>
        <li>
          <Radio className={styles.icon} />
        </li>
        <li>
          <Mic className={styles.icon} />
        </li>
        <li>
          <Upload className={styles.icon} />
        </li>
        <li>
          <CircleUserRound className={styles.icon} />
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
