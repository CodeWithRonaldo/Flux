import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home/Home";
import LoginPage from "./routes/LoginPage/LoginPage";
import SignupPage from "./routes/SignupPage/SignupPage";
import Play from "./routes/Play/Play";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
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
        path: "play",
        element: <Play />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
