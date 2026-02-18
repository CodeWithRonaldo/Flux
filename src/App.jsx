import { Outlet, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import BottomPlayer from "./components/BottomPlayer/BottomPlayer";
import { useAudio } from "./hooks/useAudio";

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay;

  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
      <SideBar />
      {shouldShowBottomPlayer && <BottomPlayer />}
    </div>
  );
}

export default App;
