import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { events } from "@/data/clubData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayOfWeek(dateStr: string): string | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return DAYS[d.getUTCDay()];
}

const categoryColors: Record<string, string> = {
  "Health": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Community Service": "bg-blue-100 text-blue-800 border-blue-200",
  "Fundraiser": "bg-amber-100 text-amber-800 border-amber-200",
  "Youth": "bg-purple-100 text-purple-800 border-purple-200",
  "Environment": "bg-green-100 text-green-800 border-green-200",
};

export default function Events() {
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

      {/* Events List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {events.length === 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-center py-20 bg-muted/40 rounded-2xl border border-border" data-testid="events-empty"
            >
              <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">Check back soon — we're always planning our next service project.</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`event-card-${event.id}`}
                  className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Date Sidebar */}
                    <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center p-8 md:w-40 md:min-w-[10rem] shrink-0">
                      {getDayOfWeek(event.date) && (
                        <div className="text-secondary/80 font-bold text-xs uppercase tracking-widest mb-1">{getDayOfWeek(event.date)}</div>
                      )}
                      <div className="text-secondary font-black text-5xl leading-none">{event.date.split(" ")[1]?.replace(",", "")}</div>
                      <div className="text-primary-foreground/80 font-bold text-lg uppercase tracking-wide">{event.date.split(" ")[0]}</div>
                      <div className="text-primary-foreground/60 text-sm mt-1">{event.date.split(" ")[2]}</div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1">
                      <div className="flex flex-wrap items-start gap-3 mb-4">
                        <Badge
                          className={`font-semibold border ${categoryColors[event.category] || "bg-muted text-muted-foreground border-border"}`}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-4">{event.title}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-5">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-secondary shrink-0" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-secondary shrink-0" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>
                      {event.registrationLink ? (
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" data-testid={`event-register-${event.id}`}>
                            Register Now <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold" data-testid={`event-contact-${event.id}`}>
                          Contact for Details
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Volunteer at Our Events</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Whether you're a member or a community supporter, there's always a place for you at our events.
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10" data-testid="events-volunteer-cta">
              Get Involved
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
