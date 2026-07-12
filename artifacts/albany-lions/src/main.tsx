import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// Redirect *.replit.app visitors to the canonical domain in production.
// This is a client-side belt-and-suspenders on top of the server-side 301.
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host.endsWith(".replit.app")) {
    window.location.replace(
      `https://albanylionsclub.org${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
