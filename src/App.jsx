/* eslint-disable react-hooks/set-state-in-effect */
import { Outlet, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import BottomPlayer from "./components/BottomPlayer/BottomPlayer";
import { useAudio } from "./hooks/useAudio";
import { useState, useEffect } from "react";
import RoleSelectionModal from "./components/RoleSelectionModal/RoleSelectionModal";
import { useIota } from "./hooks/useIota";
import StreamEarnTracker from "./components/StreamEarnTracker/StreamEarnTracker";
import GlobalSearch from "./components/GlobalSearch/GlobalSearch";
import useFetchUsers from "./hooks/useFetchUsers";

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();
  const [isSelectRole, setIsSelectRole] = useState(false);

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");
  const isLibrary = location.pathname.startsWith("/library");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay && !isLibrary;

  const { address } = useIota();
  const { registeredArtists, currentUser, isLoading } = useFetchUsers();

  useEffect(() => {
    if (address && !isLoading) {
      if (currentUser) {
        setIsSelectRole(false);
      } else {
        setIsSelectRole(true);
      }
    } else if (!address) {
      setIsSelectRole(false);
    }
  }, [address, isLoading, currentUser]);

  return (
    <div className={styles.mainContainer}>
      <Header currentUser={currentUser} />
      <div className={styles.contentContainer}>
        <Outlet
          context={{
            registeredArtists: registeredArtists,
            currentUser: currentUser,
          }}
        />
      </div>
      <SideBar currentUser={currentUser} />
      {shouldShowBottomPlayer && <BottomPlayer />}
      <StreamEarnTracker currentUser={currentUser} />

      <RoleSelectionModal
        isOpen={isSelectRole}
        onClose={() => setIsSelectRole(false)}
      />
      <GlobalSearch />
    </div>
  );
}

export default App;
