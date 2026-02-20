import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home/Home";
import SignupPage from "./routes/SignupPage/SignupPage";
import Play from "./routes/Play/Play";
import Library from "./routes/Library/Library";
import Upload from "./routes/Upload/Upload";
import Profile from "./routes/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignupPage />,
  },
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
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
