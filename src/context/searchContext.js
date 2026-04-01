import { createContext } from "react";

export const SearchContext = createContext({
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});
