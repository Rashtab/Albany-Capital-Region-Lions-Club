import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, addMonths, subMonths, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar, Loader2, CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";

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

const CATEGORY_COLORS: Record<string, string> = {
  Milestone: "bg-secondary text-secondary-foreground",
  Health: "bg-green-500 text-white",
  Community: "bg-blue-500 text-white",
  Youth: "bg-purple-500 text-white",
  Fundraiser: "bg-orange-500 text-white",
  Meeting: "bg-gray-500 text-white",
  General: "bg-primary text-primary-foreground",
};
function catColor(cat: string | null) {
  return CATEGORY_COLORS[cat ?? ""] ?? CATEGORY_COLORS["General"];
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    apiFetch<CalEvent[]>("/api/calendar")
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart);

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(parseISO(e.eventDate), day));

  const selectedEvents = selected ? getEventsForDay(selected) : [];

  const upcomingEvents = events.filter((e) => {
    const d = parseISO(e.eventDate);
    return d >= new Date(new Date().setHours(0, 0, 0, 0));
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">What's Happening</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Events Calendar</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
              Stay up to date with all Albany Capital Region Lions Club events, service projects, and meetings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* View Toggle */}
      <div className="bg-card border-b border-border py-4 px-4">
        <div className="container mx-auto max-w-5xl flex gap-2 justify-center">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
            className="gap-1.5"
          >
            <Calendar className="h-4 w-4" /> Calendar View
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className="gap-1.5"
          >
            <CalendarDays className="h-4 w-4" /> List View
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : view === "calendar" ? (
        <div className="container mx-auto px-4 max-w-5xl py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar grid */}
            <div className="flex-1">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover:bg-muted transition-colors">
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>
                <h2 className="text-xl font-black text-primary">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover:bg-muted transition-colors">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDow }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = selected && isSameDay(day, selected);
                  const today = isToday(day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelected(isSameDay(day, selected ?? new Date(0)) ? null : day)}
                      className={`aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-sm font-semibold transition-all border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : today
                          ? "bg-secondary/20 text-primary border-secondary"
                          : "hover:bg-muted border-transparent text-foreground"
                      }`}
                    >
                      <span>{format(day, "d")}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-secondary" : catColor(e.category).split(" ")[0]}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event detail panel */}
            <div className="lg:w-72 shrink-0">
              {selected ? (
                <div>
                  <h3 className="font-black text-primary mb-4 text-sm uppercase tracking-wide">
                    {format(selected, "MMMM d, yyyy")}
                  </h3>
                  {selectedEvents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No events on this day.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedEvents.map((e) => <EventCard key={e.id} event={e} />)}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="font-black text-primary mb-4 text-sm uppercase tracking-wide">Upcoming Events</h3>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No upcoming events.</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.slice(0, 5).map((e) => <EventCard key={e.id} event={e} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div className="container mx-auto px-4 max-w-4xl py-10">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-primary mb-2">No Upcoming Events</h2>
              <p className="text-muted-foreground">Check back soon for new events.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((e, i) => (
                <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <EventCard event={e} large />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, large }: { event: CalEvent; large?: boolean }) {
  return (
    <div className={`bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all ${large ? "p-5" : "p-4"}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 bg-primary/10 rounded-lg p-2 text-center min-w-12">
          <p className="text-xs font-bold text-primary">{format(parseISO(event.eventDate), "MMM")}</p>
          <p className="text-lg font-black text-primary leading-none">{format(parseISO(event.eventDate), "d")}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <h3 className={`font-black text-foreground leading-tight ${large ? "text-base" : "text-sm"}`}>{event.title}</h3>
            {event.category && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${catColor(event.category)}`}>{event.category}</span>
            )}
          </div>
          {large && event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {event.eventTime && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{event.eventTime}</span>}
            {event.location && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{event.location}</span>}
          </div>
          {large && event.registrationLink && (
            <a href={event.registrationLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-semibold hover:underline">
              Register <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
