import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import ad1 from "@assets/pdf_photo_37_232206_1777759627643.jpg";
import ad2 from "@assets/pdf_photo_38_95512_1777759627643.jpg";
import ad3 from "@assets/pdf_photo_39_59961_1777759627643.jpg";
import ad4 from "@assets/pdf_photo_41_75932_1777759627644.jpg";
import ad5 from "@assets/pdf_photo_42_60691_1777759627644.jpg";
import ad6 from "@assets/pdf_photo_43_241682_1777759627644.jpg";
import ad7 from "@assets/pdf_photo_44_123392_1777759627644.jpg";
import ad8 from "@assets/pdf_photo_45_172385_1777759627645.jpg";
import ad9 from "@assets/pdf_photo_46_74089_1777759627645.jpg";
import ad10 from "@assets/pdf_photo_47_51962_1777759627645.jpg";

const ads = [
  { src: ad1,  name: "Bismillah Mediterranean Supermarket" },
  { src: ad2,  name: "weHatbazar USA" },
  { src: ad3,  name: "Gulshan Cafe & Sweets" },
  { src: ad4,  name: "Cold Stone Creamery" },
  { src: ad5,  name: "Victoria Phillips — The Funding Store" },
  { src: ad6,  name: "Ramiz Turan — KW Platform" },
  { src: ad7,  name: "Curry House" },
  { src: ad8,  name: "Local Press NY Inc" },
  { src: ad9,  name: "Shalimar Garden Restaurant" },
  { src: ad10, name: "Tulona Zaman — Keller Williams" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
};

export default function MagazineAdvertisers() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + ads.length) % ads.length : null), []);
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % ads.length : null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close, prev, next]);

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">2026 Club Magazine</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Magazine Advertisers 2026</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto text-lg">
              We proudly recognize the businesses and community partners who advertised in our 2026 Charter Night magazine.
              Their support makes our mission possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Back link */}
      <div className="container mx-auto px-4 pt-8 pb-2 max-w-6xl">
        <Link href="/sponsors">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Sponsorship
          </button>
        </Link>
      </div>

      {/* Ad Grid */}
      <section className="py-10 pb-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                  <img
                    src={ad.src}
                    alt={ad.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-primary font-bold text-sm px-4 py-2 rounded-full shadow">
                      View Full Ad
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="font-bold text-foreground text-sm leading-snug">{ad.name}</p>
                  <p className="text-xs text-secondary font-semibold mt-0.5 uppercase tracking-wider">2026 Advertiser</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl font-black text-primary mb-3">Advertise in Our Next Magazine</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Reach the Albany Capital Region community by advertising in upcoming Lions Club publications.
              Contact us to learn about available placements.
            </p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={ads[lightbox].src}
                alt={ads[lightbox].name}
                className="max-h-[80vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
              />
              <p className="text-white/80 mt-3 text-sm font-semibold text-center">
                {ads[lightbox].name}
                <span className="text-white/40 ml-2">({lightbox + 1} / {ads.length})</span>
              </p>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
