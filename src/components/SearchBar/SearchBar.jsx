import React from "react";
import { MdLibraryMusic } from "react-icons/md";
import styles from "./SearchBar.module.css";

const SearchBar = ({ placeholder = "Search for music ...", className }) => {
  return (
    <div className={`${styles.searchBarContainer} ${className}`}>
      <input type="text" placeholder={placeholder} />
      <MdLibraryMusic size={20} color="white" />
    </div>
  );
};

export default SearchBar;
