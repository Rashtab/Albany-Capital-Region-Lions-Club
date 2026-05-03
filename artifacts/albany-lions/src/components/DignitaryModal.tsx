import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export interface Dignitary {
  name: string;
  title: string;
  message: string;
  fullMessage?: string;
  photo?: string;
}

interface Props {
  dignitaries: Dignitary[];
  photoMap: Record<string, string>;
  startIndex: number;
  onClose: () => void;
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0, transition: { duration: 0.22 } }),
};

export function DignitaryModal({ dignitaries, photoMap, startIndex, onClose }: Props) {
  const [current, setCurrent] = useState(startIndex);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (next: number) => {
      setDir(next > current ? 1 : -1);
      setCurrent((next + dignitaries.length) % dignitaries.length);
    },
    [current, dignitaries.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft")  go(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go, onClose]);

  const d     = dignitaries[current];
  const photo = d.photo ? photoMap[d.photo] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute top-3 left-3 z-20 bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          {current + 1} / {dignitaries.length}
        </div>

        {/* Sliding content */}
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col md:flex-row"
          >
            {/* Left — portrait */}
            <div className="md:w-64 shrink-0 bg-primary flex flex-col items-center justify-center py-10 px-6 relative">
              {photo ? (
                <img
                  src={photo}
                  alt={d.name}
                  className="w-44 h-56 object-cover object-top rounded-xl border-4 border-secondary/50 shadow-lg"
                />
              ) : (
                <div className="w-44 h-56 rounded-xl bg-white/10 flex items-center justify-center">
                  <UserCircle2 className="h-24 w-24 text-white/30" />
                </div>
              )}
              <div className="mt-5 text-center">
                <p className="text-white font-black text-base leading-tight">{d.name}</p>
                <p className="text-secondary text-xs font-semibold mt-1 leading-snug">{d.title}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/60" />
            </div>

            {/* Right — message */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-7 py-4 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Congratulatory Message
                </span>
              </div>
              <div className="px-7 py-6 overflow-y-auto max-h-[50vh]">
                <Quote className="h-6 w-6 text-secondary mb-4 opacity-70" />
                {(d.fullMessage ?? d.message).split("\n\n").map((para, pi) => (
                  <p key={pi} className="text-foreground/80 leading-relaxed italic mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/40">
          <button
            onClick={() => go(current - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5 items-center">
            {dignitaries.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === current ? "bg-primary w-4" : "bg-muted-foreground/30 w-2"
                }`}
                aria-label={`Go to ${dignitaries[i].name}`}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
