import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, Mail, Loader2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiFetch } from "@/lib/auth";
import { parseISO, format } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

interface CalEvent {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  location: string | null;
  category: string | null;
  registrationLink: string | null;
}

const categoryColors: Record<string, string> = {
  Milestone: "bg-secondary/20 text-yellow-800 border-secondary/40",
  Health: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Community: "bg-blue-100 text-blue-800 border-blue-200",
  Fundraiser: "bg-amber-100 text-amber-800 border-amber-200",
  Youth: "bg-purple-100 text-purple-800 border-purple-200",
  Meeting: "bg-gray-100 text-gray-700 border-gray-200",
  General: "bg-muted text-muted-foreground border-border",
};

function formatEventDate(dateStr: string) {
  const d = parseISO(dateStr);
  return {
    dayOfWeek: format(d, "EEEE"),
    day: format(d, "d"),
    month: format(d, "MMM"),
    year: format(d, "yyyy"),
    full: format(d, "MMMM d, yyyy"),
  };
}

const CHARTER_POSTER = "/uploads/images/charter-night-poster.png";

export default function Events() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<CalEvent[]>("/api/calendar")
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter((e) => parseISO(e.eventDate) >= today);
  const past = events.filter((e) => parseISO(e.eventDate) < today);

  const nextEvent = upcoming[0] ?? null;
  const isCharterNext =
    nextEvent?.title.toLowerCase().includes("charter night") ||
    nextEvent?.title.toLowerCase().includes("installation");

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
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

                  <div className="bg-card border-2 border-secondary/30 rounded-2xl overflow-hidden shadow-xl">
                    <div className="flex flex-col lg:flex-row">
                      {/* Poster image — shown for Charter Night or any Milestone */}
                      {isCharterNext && (
                        <div className="lg:w-72 xl:w-80 shrink-0 bg-primary/5">
                          <img
                            src={CHARTER_POSTER}
                            alt="Charter Night & Installation Ceremony poster"
                            className="w-full h-full object-cover object-top"
                            style={{ maxHeight: 480 }}
                          />
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

                        <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-5">
                          {nextEvent.title}
                        </h2>

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-secondary shrink-0" />
                            <span className="font-semibold text-foreground">{formatEventDate(nextEvent.eventDate).full}</span>
                          </div>
                          {nextEvent.eventTime && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 text-secondary shrink-0" />
                              <span>{nextEvent.eventTime}</span>
                            </div>
                          )}
                          {nextEvent.location && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                              <span>{nextEvent.location}</span>
                            </div>
                          )}
                        </div>

                        {nextEvent.description && (
                          <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
                            {nextEvent.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {nextEvent.registrationLink && (
                            <a
                              href={nextEvent.registrationLink}
                              target={nextEvent.registrationLink.startsWith("http") ? "_blank" : undefined}
                              rel="noreferrer"
                            >
                              <Button className="font-bold gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                {nextEvent.registrationLink.startsWith("mailto:") ? (
                                  <><Mail className="h-4 w-4" /> RSVP via Email</>
                                ) : (
                                  <><ExternalLink className="h-4 w-4" /> Register Now</>
                                )}
                              </Button>
                            </a>
                          )}
                          <Link href="/calendar">
                            <Button variant="outline" className="font-semibold gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                              View Full Calendar <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                  className="text-center py-20 bg-muted/40 rounded-2xl border border-border">
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">Check back soon — we're always planning our next service project.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-primary mb-8">All Upcoming Events</h2>
                  <div className="space-y-6">
                    {upcoming.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
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
                      <EventCard key={event.id} event={event} index={i} compact />
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
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
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

function EventCard({ event, index, compact = false }: { event: CalEvent; index: number; compact?: boolean }) {
  const { day, month, year, dayOfWeek } = formatEventDate(event.eventDate);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div className="flex flex-col md:flex-row">
        {/* Date Sidebar */}
        <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center px-6 py-6 md:w-36 md:min-w-[9rem] shrink-0">
          <div className="text-secondary/80 font-bold text-xs uppercase tracking-widest mb-1 hidden md:block">{dayOfWeek.slice(0, 3)}</div>
          <div className="text-secondary font-black text-5xl leading-none">{day}</div>
          <div className="text-primary-foreground/80 font-bold text-base uppercase tracking-wide">{month}</div>
          <div className="text-primary-foreground/60 text-sm">{year}</div>
        </div>

        {/* Content */}
        <div className={`${compact ? "p-5" : "p-7"} flex-1`}>
          <div className="flex flex-wrap items-start gap-2 mb-3">
            <Badge className={`font-semibold border ${categoryColors[event.category ?? "General"] ?? categoryColors.General}`}>
              {event.category ?? "General"}
            </Badge>
          </div>
          <h3 className={`font-black text-foreground mb-3 ${compact ? "text-lg" : "text-2xl"}`}>{event.title}</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground mb-4">
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
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm line-clamp-2">{event.description}</p>
          )}
          {event.registrationLink && !compact && (
            <a
              href={event.registrationLink}
              target={event.registrationLink.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold gap-1.5" size="sm">
                {event.registrationLink.startsWith("mailto:") ? (
                  <><Mail className="h-3.5 w-3.5" /> RSVP</>
                ) : (
                  <><ExternalLink className="h-3.5 w-3.5" /> Register</>
                )}
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
