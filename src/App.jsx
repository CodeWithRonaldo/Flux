import { Outlet, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import BottomPlayer from "./components/BottomPlayer/BottomPlayer";
import { useAudio } from "./hooks/useAudio";
import { useState, useEffect } from "react";
import RoleSelectionModal from "./components/RoleSelectionModal/RoleSelectionModal";
import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariables } from "./config/networkConfig";
import { useIota } from "./hooks/useIota";
import StreamEarnTracker from "./components/StreamEarnTracker/StreamEarnTracker";
import GlobalSearch from "./components/GlobalSearch/GlobalSearch";

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();
  const [isSelectRole, setIsSelectRole] = useState(false);

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");
  const isLibrary = location.pathname.startsWith("/library");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay && !isLibrary;

  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const { address } = useIota();

  const { data: registeredUsers, isLoading } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::UserRegistered`,
      },
    },
    {
      select: (data) => data.data.flatMap((x) => x.parsedJson),
      // .filter((y) => y.owner === address),
      refetchInterval: 3000,
    },
  );

  const currentUser = registeredUsers?.filter((user) => user.owner === address);

  useEffect(() => {
    if (address && !isLoading) {
      if (currentUser && currentUser.length > 0) {
        setIsSelectRole(false);
      } else {
        setIsSelectRole(true);
      }
    } else if (!address) {
      setIsSelectRole(false);
    }
  }, [address, isLoading]);

  return (
    <div className={styles.mainContainer}>
      <Header currentUser={currentUser} />
      <div className={styles.contentContainer}>
        <Outlet context={registeredUsers} />
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
