import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Smartphone, Info } from "lucide-react";

const ZEFFY_EMBED_URL =
  "https://www.zeffy.com/embed/donation-form/donate-to-change-lives-18069";

const ZEFFY_MIN_HEIGHT = 520;

function ZeffyNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 flex gap-2">
      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
      <span>
        <strong>About Zeffy's optional contribution:</strong> Zeffy may suggest
        a separate contribution to support its fee-free platform. To decline it,
        select <strong>Other</strong> in the Zeffy contribution menu before
        completing payment.
      </span>
    </div>
  );
}

function useZeffyResize(defaultHeight: number) {
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        typeof event.origin === "string" &&
        !event.origin.includes("zeffy.com")
      )
        return;

      let h: number | undefined;
      const d = event.data;

      if (typeof d === "number" && d > 100) {
        h = d;
      } else if (d && typeof d === "object") {
        const candidate =
          d.height ??
          d.frameHeight ??
          d.documentHeight ??
          d.scrollHeight ??
          (typeof d.message === "string"
            ? Number(d.message.replace(/\D/g, ""))
            : undefined);
        if (typeof candidate === "number" && candidate > 100) h = candidate;
      } else if (typeof d === "string") {
        const m = d.match(/(\d{3,4})/);
        if (m) h = Number(m[1]);
      }

      if (h && h > 100 && h < 4000) {
        setHeight(Math.max(ZEFFY_MIN_HEIGHT, h + 32));
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return height;
}

/**
 * QR code for donating from a phone or other device.
 */
export function ZeffyQRCode({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Smartphone className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-bold text-foreground">
          Prefer to donate from your phone or another device?
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Scan this QR code to open the donation form directly.
      </p>
      <img
        src="/donate-qr.jpg"
        alt="Scan to donate — Albany Capital Region Lions Club"
        className="w-36 h-36 object-contain rounded-lg border border-border"
      />
    </div>
  );
}

/**
 * A button that opens a Dialog containing the Zeffy donation iframe.
 * Auto-resizes with the form content via postMessage.
 */
export function ZeffyDonateButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const iframeHeight = useZeffyResize(560);

  return (
    <>
      <button className={className} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-base font-black text-primary">
              Donate to Albany Capital Region Lions Club
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure donation powered by Zeffy — zero platform fees.
            </p>
          </DialogHeader>

          <div className="overflow-y-auto flex-1">
            {open && (
              <iframe
                src={ZEFFY_EMBED_URL}
                title="Donation form powered by Zeffy"
                className="w-full border-0 block"
                style={{ height: `${iframeHeight}px` }}
                allow="payment"
              />
            )}
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/30 shrink-0 space-y-3">
            <ZeffyNotice />
            <div className="flex items-start gap-4">
              <QrCode className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground mb-0.5">
                  Prefer to donate on your phone?
                </p>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code on the{" "}
                  <a
                    href="/donate"
                    className="text-primary underline underline-offset-2 font-medium"
                  >
                    Donate page
                  </a>{" "}
                  or visit{" "}
                  <a
                    href={ZEFFY_EMBED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 font-medium"
                  >
                    zeffy.com
                  </a>{" "}
                  directly.
                </p>
              </div>
              <img
                src="/donate-qr.jpg"
                alt="QR code — scan to donate"
                className="w-16 h-16 object-contain rounded border border-border shrink-0"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Renders the Zeffy embedded donation form inline on a page via iframe.
 * Auto-resizes with form content via postMessage.
 */
export function ZeffyDonateEmbed() {
  const iframeHeight = useZeffyResize(650);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="w-full">
      <iframe
        src={ZEFFY_EMBED_URL}
        title="Donation form powered by Zeffy"
        className="w-full border-0 block rounded-xl"
        style={{ height: `${iframeHeight}px` }}
        allow="payment"
      />
    </div>
  );
}

export { ZeffyNotice };
