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

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();
  const [isSelectRole, setIsSelectRole] = useState(false);

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay;

  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const { address } = useIota();

  const { data: registeredUser, isLoading } = useIotaClientQuery(
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

  const isUserRegistered = registeredUser?.filter(
    (user) => user.owner === address,
  );

  useEffect(() => {
    if (address && !isLoading) {
      if (isUserRegistered && isUserRegistered.length > 0) {
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
      <Header />
      <div className={styles.contentContainer}>
        <Outlet context={registeredUser} />
      </div>
      <SideBar isUserRegistered={isUserRegistered} />
      {shouldShowBottomPlayer && <BottomPlayer />}

      <RoleSelectionModal
        isOpen={isSelectRole}
        onClose={() => setIsSelectRole(false)}
      />
    </div>
  );
}

export default App;
