import React from "react";
import { MdLibraryMusic } from "react-icons/md";
import styles from "./SearchBar.module.css";

const SearchBar = ({ placeholder = "Search for music ..." }) => {
  return (
    <div className={styles.searchBarContainer}>
      <input type="text" placeholder={placeholder} />
      <MdLibraryMusic size={20} color="white"  />
    </div>
  );
};

export default SearchBar;
