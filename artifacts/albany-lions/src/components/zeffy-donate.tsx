import { useEffect, useRef } from "react";

const ZEFFY_POPUP_URL =
  "https://www.zeffy.com/embed/donation-form/donate-to-change-lives-18069?modal=true";
const ZEFFY_EMBED_PATH =
  "/embed/donation-form/donate-to-change-lives-18069";
const ZEFFY_EMBED_SCRIPT =
  "https://www.zeffy.com/embed/v2/zeffy-embed.js";

/**
 * A button that opens the Zeffy donation form as a modal popup.
 * The `zeffy-form-link` attribute is set via a DOM ref so TypeScript
 * doesn't complain about the non-standard HTML attribute.
 */
export function ZeffyDonateButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.setAttribute("zeffy-form-link", ZEFFY_POPUP_URL);
  }, []);

  return (
    <button ref={ref} className={className} type="button">
      {children}
    </button>
  );
}

/**
 * Renders the Zeffy embedded donation form inline on a page.
 * Loads zeffy-embed.js on mount (idempotent — won't double-load).
 * Shows a direct iframe fallback if the script fails to load.
 */
export function ZeffyDonateEmbed() {
  const embedRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set custom data attributes imperatively to avoid TypeScript issues
    if (embedRef.current) {
      embedRef.current.setAttribute("data-zeffy-embed", "");
      embedRef.current.setAttribute("data-form-url", ZEFFY_EMBED_PATH);
    }
    if (iframeRef.current) {
      iframeRef.current.setAttribute(
        "data-zeffy-embed-src",
        `https://www.zeffy.com${ZEFFY_EMBED_PATH}`,
      );
    }

    // Load the Zeffy embed script (idempotent)
    const SCRIPT_ID = "zeffy-embed-v2";
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = ZEFFY_EMBED_SCRIPT;
    script.onerror = () => {
      // On script failure, show the iframe fallback
      if (fallbackRef.current) {
        fallbackRef.current.style.display = "block";
      }
      if (iframeRef.current) {
        iframeRef.current.src = `https://www.zeffy.com${ZEFFY_EMBED_PATH}`;
      }
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div>
      {/* Primary embed target — Zeffy script replaces this div with the form */}
      <div ref={embedRef} />

      {/* Iframe fallback — hidden unless the script fails to load */}
      <div ref={fallbackRef} style={{ display: "none" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: "650px",
            width: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            title="Donation form powered by Zeffy"
            style={{
              position: "absolute",
              border: 0,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
