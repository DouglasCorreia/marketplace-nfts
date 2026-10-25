import React from "react";
import ReactDOM from "react-dom/client";
import { Providers } from "./app/providers";
import "./styles/globals.css";

async function start() {
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true") {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
    } catch (error) {
      // A falha do service worker de desenvolvimento não deve impedir o app de montar.
      console.error("Não foi possível iniciar os mocks do navegador.", error);
    }
  }
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>
  );
}

void start();
