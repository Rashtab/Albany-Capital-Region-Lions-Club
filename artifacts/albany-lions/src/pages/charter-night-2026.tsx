import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function CharterNight2026() {
  useEffect(() => {
    document.title = "Charter Night & Installation Ceremony 2026 — Albany Capital Region Lions Club";
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-black z-50">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0a1f5c] border-b border-[#c8960c]/40 shrink-0">
        <Link href="/events">
          <span className="flex items-center gap-1 text-[#f0c84a] text-sm font-semibold hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            Back to Events
          </span>
        </Link>
        <span className="h-4 w-px bg-white/20" />
        <span className="text-white/80 text-sm">
          Charter Night &amp; Installation Ceremony — May 3, 2026
        </span>
        <span className="ml-auto text-[#c8960c] text-xs font-semibold uppercase tracking-widest">
          Albany Capital Region Lions Club
        </span>
      </div>
      <iframe
        src="/charter-night-2026/index.html"
        title="Charter Night & Installation Ceremony 2026 Slideshow"
        className="flex-1 w-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
