import { Outlet, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import BottomPlayer from "./components/BottomPlayer/BottomPlayer";
import { useAudio } from "./hooks/useAudio";
import { useState } from "react";
import RoleSelectionModal from "./components/RoleSelectionModal/RoleSelectionModal";
import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariables } from "./config/networkConfig";
import { useIota } from "./hooks/useIota";

function App() {
  const location = useLocation();
  const { currentTrack, isBottomPlayerVisible } = useAudio();
  const [tisConnected, setTisConnected] = useState(true);

  const isHome = location.pathname === "/";
  const isPlay = location.pathname.startsWith("/play");

  const shouldShowBottomPlayer =
    isBottomPlayerVisible && currentTrack && !isHome && !isPlay;

  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const { address } = useIota();

  const { data: registeredUser } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::UserRegistered`,
      },
    },
    {
      select: (data) =>
        data.data
          .flatMap((x) => x.parsedJson)
          .filter((y) => y.owner === address),
    },
  );
  console.log("registeredUser", registeredUser[0].role);
  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
      <SideBar registeredUser={registeredUser} />
      {shouldShowBottomPlayer && <BottomPlayer />}

      <RoleSelectionModal
        isOpen={tisConnected}
        onClose={() => setTisConnected(false)}
      />
    </div>
  );
}

export default App;
