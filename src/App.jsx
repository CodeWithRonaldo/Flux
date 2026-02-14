import { Outlet } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";

function App() {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <SideBar />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
