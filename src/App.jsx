import { Outlet, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import BottomPlayer from "./components/BottomPlayer/BottomPlayer";
import { useAudio } from "./hooks/useAudio";
import ConnectModal from "./components/ConnectModal/ConnectModal";
import { useState } from "react";

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleConnectClick = () => {
    setIsConnectModalOpen(true);
  };

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay;

  return (
    <div className={styles.mainContainer}>
      <Header onConnectClick={handleConnectClick} />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
      <SideBar />
      {shouldShowBottomPlayer && <BottomPlayer />}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}

export default App;
