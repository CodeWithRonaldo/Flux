import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AudioProvider } from "./context/AudioProvider.jsx";
import PlayListProvider from "./context/PlayListProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayListProvider>
      <AudioProvider>
        <RouterProvider router={router} />
      </AudioProvider>
    </PlayListProvider>
  </StrictMode>,
);
