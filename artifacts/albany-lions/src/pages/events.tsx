import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import {
  Calendar, Clock, MapPin, ExternalLink, Mail,
  Loader2, ChevronRight, ChevronLeft, X, ZoomIn, Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiFetch } from "@/lib/auth";
import { parseISO, format } from "date-fns";

/* ── types ─────────────────────────────────────────────────── */
interface CalEvent {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  location: string | null;
  category: string | null;
  registrationLink: string | null;
  posterUrl: string | null;
}

/* ── helpers ────────────────────────────────────────────────── */
const categoryColors: Record<string, string> = {
  Milestone:  "bg-secondary/20 text-yellow-800 border-secondary/40",
  Health:     "bg-emerald-100 text-emerald-800 border-emerald-200",
  Community:  "bg-blue-100 text-blue-800 border-blue-200",
  Fundraiser: "bg-amber-100 text-amber-800 border-amber-200",
  Youth:      "bg-purple-100 text-purple-800 border-purple-200",
  Meeting:    "bg-gray-100 text-gray-700 border-gray-200",
  General:    "bg-muted text-muted-foreground border-border",
};

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function formatDate(dateStr: string) {
  const d = parseISO(dateStr);
  return {
    day:       format(d, "d"),
    dayOfWeek: format(d, "EEEE"),
    month:     format(d, "MMM"),
    year:      format(d, "yyyy"),
    full:      format(d, "MMMM d, yyyy"),
  };
}

function rsvpIsEmail(link: string) {
  return link.startsWith("mailto:");
}

/* ── Event Modal ────────────────────────────────────────────── */
function EventModal({
  events, startIndex, onClose,
}: {
  events: CalEvent[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (next: number) => {
      setDir(next > current ? 1 : -1);
      setCurrent((next + events.length) % events.length);
    },
    [current, events.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  go(current + 1);
      if (e.key === "ArrowLeft")   go(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go, onClose]);

  const event  = events[current];
  const poster = event.posterUrl ?? null;
  const dates  = formatDate(event.eventDate);
  const cat    = event.category ?? "General";

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit:   (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.22 } }),
  };

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
        className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute top-3 left-3 z-20 bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          {current + 1} / {events.length}
        </div>

        {/* Sliding content */}
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={event.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col"
          >
            {/* Full poster image — no height cap */}
            {poster ? (
              <div className="w-full bg-primary/5">
                <img
                  src={poster}
                  alt={event.title}
                  className="w-full h-auto block"
                />
              </div>
            ) : (
              /* Colour-band header when no poster */
              <div className="h-24 bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-end px-8 pb-4">
                <span className="text-secondary font-black text-xs uppercase tracking-widest">
                  {dates.full}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="px-6 sm:px-8 pt-5 pb-6">
              {/* Category */}
              <Badge className={`font-bold border mb-3 ${categoryColors[cat] ?? categoryColors.General}`}>
                ★ {cat}
              </Badge>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-4">
                {event.title}
              </h2>

              {/* Meta */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-secondary shrink-0" />
                  <span className="font-semibold text-foreground">{dates.full}</span>
                </div>
                {event.eventTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-secondary shrink-0" />
                    {event.eventTime}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    {event.location}
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {event.description}
                </p>
              )}

              {/* RSVP / Register */}
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target={rsvpIsEmail(event.registrationLink) ? undefined : "_blank"}
                  rel="noreferrer"
                >
                  <Button className="w-full font-bold gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    {rsvpIsEmail(event.registrationLink) ? (
                      <><Mail className="h-4 w-4" /> RSVP via Email</>
                    ) : (
                      <><ExternalLink className="h-4 w-4" /> Register Now</>
                    )}
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next bar */}
        <div className="flex border-t border-border">
          <button
            onClick={() => go(current - 1)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => go(current + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Event Card (list) ──────────────────────────────────────── */
function EventCard({
  event, index, compact = false, onClick,
}: {
  event: CalEvent; index: number; compact?: boolean; onClick: () => void;
}) {
  const { day, month, year, dayOfWeek } = formatDate(event.eventDate);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      onClick={onClick}
      className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Date sidebar */}
        <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center px-6 py-6 md:w-36 md:min-w-[9rem] shrink-0">
          <div className="text-secondary/80 font-bold text-xs uppercase tracking-widest mb-1 hidden md:block">
            {dayOfWeek.slice(0, 3)}
          </div>
          <div className="text-secondary font-black text-5xl leading-none">{day}</div>
          <div className="text-primary-foreground/80 font-bold text-base uppercase tracking-wide">{month}</div>
          <div className="text-primary-foreground/60 text-sm">{year}</div>
        </div>

        {/* Content */}
        <div className={`${compact ? "p-5" : "p-7"} flex-1 flex flex-col justify-center`}>
          <Badge className={`w-fit font-semibold border mb-3 ${categoryColors[event.category ?? "General"] ?? categoryColors.General}`}>
            {event.category ?? "General"}
          </Badge>
          <h3 className={`font-black text-foreground mb-2 group-hover:text-primary transition-colors ${compact ? "text-lg" : "text-2xl"}`}>
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground mb-3">
            {event.eventTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary shrink-0" />
                {event.eventTime}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-secondary shrink-0" />
                {event.location}
              </div>
            )}
          </div>
          {!compact && event.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
          )}
          <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-3 w-3" /> Click to view details
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Events() {
  const [events, setEvents]       = useState<CalEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<CalEvent[]>("/api/calendar")
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter((e) => parseISO(e.eventDate) >= today);
  const past     = events.filter((e) => parseISO(e.eventDate) < today);

  const nextEvent = upcoming[0] ?? null;

  /* index of a given event inside the FULL events array (for the modal) */
  const globalIndex = (ev: CalEvent) => events.findIndex((e) => e.id === ev.id);

  return (
    <div className="flex flex-col">
      <PageMeta
        title="Events & Programs"
        path="/events"
        description="Upcoming events and programs from the Albany Capital Region Lions Club. Join us for community service projects, fundraisers, and social gatherings in Albany and Schenectady."
      />
      {/* Modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <EventModal
            events={events}
            startIndex={modalIndex}
            onClose={() => setModalIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }}
        />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Get Involved</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Upcoming Events</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-xl mx-auto">
              Join us at our upcoming events and be part of the difference we make in the Albany Capital Region.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CHARTER NIGHT 2026 FEATURED HIGHLIGHT ── */}
      <section className="py-14 bg-gradient-to-br from-[#0a1f5c] to-[#050f30] text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-[#f0c84a] rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest text-[#f0c84a]">
                Featured Event
              </span>
              <span className="h-1 flex-1 bg-[#f0c84a]/20 rounded-full" />
            </div>

            <div className="bg-white/5 border border-[#c8960c]/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row">
                {/* Left — thumbnail / poster */}
                <div className="lg:w-64 xl:w-72 shrink-0 bg-gradient-to-br from-[#1a3580] to-[#050f30] flex items-center justify-center p-8">
                  <img
                    src="/charter-night-2026/uploads/docx_img_image1.png"
                    alt="Albany Capital Region Lions Club Logo"
                    className="w-40 h-40 object-contain drop-shadow-lg"
                  />
                </div>

                {/* Right — info */}
                <div className="p-8 lg:p-10 flex flex-col justify-center flex-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#c8960c]/20 text-[#f0c84a] border border-[#c8960c]/50 font-bold">
                      ★ Milestone
                    </Badge>
                    <Badge className="bg-white/10 text-white/80 border border-white/20 font-semibold text-xs">
                      Past Event
                    </Badge>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    Charter Night &amp;{" "}
                    <span className="text-[#f0c84a]">Installation Ceremony</span>
                  </h2>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Calendar className="h-4 w-4 text-[#f0c84a] shrink-0" />
                      <span className="font-semibold">Sunday, May 3, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4 text-[#f0c84a] shrink-0" />
                      Albany Capital Region, NY
                    </div>
                  </div>

                  <p className="text-white/65 text-sm leading-relaxed max-w-xl">
                    Our historic charter night and installation ceremony — the founding moment of the
                    Albany Capital Region Lions Club. Watch the full photo slideshow with music from
                    that memorable evening.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <a href="/charter-night-2026">
                      <Button className="bg-[#c8960c] hover:bg-[#a07000] text-[#0a1f5c] font-black gap-2 px-6">
                        <Play className="h-4 w-4 fill-current" />
                        Watch Slideshow
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* ── NEXT EVENT SPOTLIGHT ── */}
          {nextEvent && (
            <section className="py-14 bg-gradient-to-b from-primary/5 to-background border-b border-border">
              <div className="container mx-auto px-4 max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-8 bg-secondary rounded-full" />
                    <span className="text-xs font-black uppercase tracking-widest text-secondary">Next Event</span>
                    <span className="h-1 flex-1 bg-secondary/20 rounded-full" />
                  </div>

                  {/* Clickable card */}
                  <div
                    className="bg-card border-2 border-secondary/30 rounded-2xl overflow-hidden shadow-xl cursor-pointer group hover:border-secondary/60 hover:shadow-2xl transition-all"
                    onClick={() => setModalIndex(globalIndex(nextEvent))}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Poster */}
                      {nextEvent.posterUrl && (
                        <div className="lg:w-72 xl:w-80 shrink-0 relative overflow-hidden">
                          <img
                            src={nextEvent.posterUrl}
                            alt={nextEvent.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            style={{ maxHeight: 460 }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                              <ZoomIn className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="p-8 lg:p-10 flex flex-col justify-center flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={`font-bold border ${categoryColors[nextEvent.category ?? "General"] ?? categoryColors.General}`}>
                            ★ {nextEvent.category ?? "Event"}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-secondary text-secondary font-semibold">
                            Coming Up
                          </Badge>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-5 group-hover:text-primary/80 transition-colors">
                          {nextEvent.title}
                        </h2>

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-secondary shrink-0" />
                            <span className="font-semibold text-foreground">{formatDate(nextEvent.eventDate).full}</span>
                          </div>
                          {nextEvent.eventTime && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 text-secondary shrink-0" />
                              {nextEvent.eventTime}
                            </div>
                          )}
                          {nextEvent.location && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                              {nextEvent.location}
                            </div>
                          )}
                        </div>

                        {nextEvent.description && (
                          <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base line-clamp-3">
                            {nextEvent.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {nextEvent.registrationLink && (
                            <a
                              href={nextEvent.registrationLink}
                              target={nextEvent.registrationLink.startsWith("http") ? "_blank" : undefined}
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button className="font-bold gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                {rsvpIsEmail(nextEvent.registrationLink) ? (
                                  <><Mail className="h-4 w-4" /> RSVP via Email</>
                                ) : (
                                  <><ExternalLink className="h-4 w-4" /> Register Now</>
                                )}
                              </Button>
                            </a>
                          )}
                          <Link href="/calendar" onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" className="font-semibold gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                              View Full Calendar <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>

                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                          <ZoomIn className="h-3.5 w-3.5" /> Click anywhere on this card to see full details
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* ── ALL UPCOMING EVENTS LIST ── */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              {upcoming.length === 0 ? (
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={0}
                  className="text-center py-20 bg-muted/40 rounded-2xl border border-border"
                >
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">Check back soon — we're always planning our next service project.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-primary mb-8">All Upcoming Events</h2>
                  <div className="space-y-6">
                    {upcoming.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={i}
                        onClick={() => setModalIndex(globalIndex(event))}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Past events */}
              {past.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-xl font-black text-muted-foreground mb-6">Past Events</h2>
                  <div className="space-y-4 opacity-60">
                    {[...past].reverse().map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={i}
                        compact
                        onClick={() => setModalIndex(globalIndex(event))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Volunteer CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Volunteer at Our Events</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Whether you're a member or a community supporter, there's always a place for you at our events.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
