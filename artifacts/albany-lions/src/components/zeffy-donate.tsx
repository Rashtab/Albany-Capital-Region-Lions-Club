import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Smartphone } from "lucide-react";

const ZEFFY_EMBED_URL =
  "https://www.zeffy.com/embed/donation-form/donate-to-change-lives-18069";

/**
 * QR code for donating from a phone or other device.
 * Image is served from /donate-qr.jpg in the public directory.
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
 * Does not depend on the Zeffy popup script — fully self-contained.
 */
export function ZeffyDonateButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle className="text-base font-black text-primary">
              Donate to Albany Capital Region Lions Club
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure donation powered by Zeffy — zero platform fees.
            </p>
          </DialogHeader>

          {/* Zeffy iframe */}
          <div className="relative w-full" style={{ height: "560px" }}>
            {open && (
              <iframe
                src={ZEFFY_EMBED_URL}
                title="Donation form powered by Zeffy"
                className="absolute inset-0 w-full h-full border-0"
                allow="payment"
              />
            )}
          </div>

          {/* QR code footer */}
          <div className="px-6 py-5 border-t border-border bg-muted/30 flex items-start gap-4">
            <QrCode className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground mb-0.5">
                Prefer to donate on your phone?
              </p>
              <p className="text-xs text-muted-foreground">
                Scan the QR code on the{" "}
                <a href="/donate" className="text-primary underline underline-offset-2 font-medium">
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
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Renders the Zeffy embedded donation form inline on a page via iframe.
 * No external script dependency — uses a direct iframe embed.
 */
export function ZeffyDonateEmbed() {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ height: "650px" }}
    >
      <iframe
        src={ZEFFY_EMBED_URL}
        title="Donation form powered by Zeffy"
        className="absolute inset-0 w-full h-full border-0"
        allow="payment"
      />
    </div>
  );
}
