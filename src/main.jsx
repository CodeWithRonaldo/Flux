import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AudioProvider } from "./context/AudioProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AudioProvider>
      <RouterProvider router={router} />
    </AudioProvider>
  </StrictMode>,
);
