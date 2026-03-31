import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home/Home";
import Play from "./routes/Play/Play";
import Library from "./routes/Library/Library";
import Upload from "./routes/Upload/Upload";
import Profile from "./routes/Profile/Profile";
import Search from "./routes/Search/Search";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "play/:id",
        element: <Play />,
      },
      {
        path: "library",
        element: <Library />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "upload/:id",
        element: <Upload />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
