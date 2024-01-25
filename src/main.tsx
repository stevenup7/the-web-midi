import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MidiController from "./pages/controller/MidiController";
import NotFound from "./pages/errors/NotFound.tsx";
import MidiConfig from "./pages/config/MidiConfig.tsx";
import HelpHome from "./pages/help/HelpHome.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MidiController />,
    errorElement: <NotFound />,
  },
  {
    path: "/config",
    element: <MidiConfig />,
  },
  {
    path: "/help/:helpPageName",
    element: <HelpHome />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App></App>
    <RouterProvider router={router} />
  </React.StrictMode>
);
