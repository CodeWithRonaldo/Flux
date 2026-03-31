import React from "react";
import { MdLibraryMusic } from "react-icons/md";
import styles from "./SearchBar.module.css";

const SearchBar = ({
  placeholder = "Search for music ...",
  className,
  value,
  onChange,
  onClick,
  readOnly,
}) => {
  return (
    <div
      className={`${styles.searchBarContainer} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "text" }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{
          cursor: onClick ? "pointer" : "text",
          pointerEvents: onClick ? "none" : "auto",
        }}
      />
      <MdLibraryMusic size={20} color="white" />
    </div>
  );
};

export default SearchBar;
