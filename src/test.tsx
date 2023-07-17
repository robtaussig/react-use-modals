import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ModalsProvider } from "./Modals.context";

const container = document.getElementById("root");

if (!container) throw "Root container not found";

const root = createRoot(container);
root.render(
  <ModalsProvider>
    <App />
  </ModalsProvider>
);
