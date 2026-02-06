import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./routes/LandingPage/LandingPage";
import Home from "./routes/Home/Home";
import LoginPage from "./routes/LoginPage/LoginPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path:"/login",
        element: <LoginPage/>
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
