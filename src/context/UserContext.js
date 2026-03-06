import { createContext } from "react";

export const UserContext = createContext({
  profile: {
    role: null,
    username: "",
    bio: "",
    genres: [],
  },
  setProfile: () => {},
});
