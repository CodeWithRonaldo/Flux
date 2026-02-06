import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home/Home";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
