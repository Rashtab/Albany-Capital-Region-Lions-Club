import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { Eye, Users, Heart, Globe, Accessibility, TreePine, ChevronRight, Calendar, Clock, MapPin, ArrowRight, Quote, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { serviceAreas, dignitaries, sponsorshipTiers, clubInfo } from "@/data/clubData";
import { DignitaryModal } from "@/components/DignitaryModal";
import { apiFetch } from "@/lib/auth";
import heroBanner from "@assets/banner_hero_optimized.webp";
import clubLogo from "@assets/WhatsApp_Image_2026-04-16_at_10.35.09_PM_-_Copy_1777727127815.jpeg";
import zohranPhoto from "@assets/Zohran_Mamdani_1777751125798.jpg";
import dorceyPhoto from "@assets/Dr._Dorcey_L._Applyrs_1777751283434.jpg";
import jenniferPhoto from "@assets/Jennifer_Rajkumar_1777751345247.jpg";
import apsinghPhoto from "@assets/A.P._Singh_int_1777751500469.jpg";
import nazmulPhoto from "@assets/Lion_Nazmul_Haque__1777751740226.jpg";
import asefPhoto from "@assets/Asef_Bari_1777751847293.jpg";
import ninaPhoto from "@assets/image_1777751996212.png";
import shahPhoto from "@assets/Shah_Newaz_1777752174421.jpg";
import ahsanPhoto from "@assets/Ahsan_Habib_1777752313909.jpg";

const dignitaryPhotoMap: Record<string, string> = {
  zohran: zohranPhoto,
  dorcey: dorceyPhoto,
  jennifer: jenniferPhoto,
  apsingh: apsinghPhoto,
  nazmul: nazmulPhoto,
  asef: asefPhoto,
  nina: ninaPhoto,
  shah: shahPhoto,
  ahsan: ahsanPhoto,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Users, Heart, Globe, Accessibility, TreePine,
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55 },
  }),
};

const tierHighlight = ["Platinum", "Gold", "Silver"];

interface CalEvent {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  location: string | null;
  category: string | null;
}

function formatEventDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const close = () => setSelectedIndex(null);

  const [missionStatement, setMissionStatement] = useState(clubInfo.missionStatement);
  const [upcomingEvents, setUpcomingEvents] = useState<CalEvent[]>([]);

  useEffect(() => {
    apiFetch<Record<string, string>>("/api/site-settings")
      .then((data) => {
        if (data.mission_statement) setMissionStatement(data.mission_statement);
      })
      .catch(() => {});

    apiFetch<CalEvent[]>("/api/calendar")
      .then((rows) => setUpcomingEvents(rows.slice(0, 2)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col">
      <PageMeta
        path="/"
        description="The Albany Capital Region Lions Club serves Albany and Schenectady through vision care, hunger relief, youth programs, and community service. Join us — We Serve, We Lead, We Impact."
      />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
        <img
          src={heroBanner}
          alt="Albany Capital Region Lions Club"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <img
              src={clubLogo}
              alt="Club Logo"
              className="w-40 h-40 rounded-full object-cover border-4 border-secondary/60 mx-auto mb-4 shadow-2xl"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span className="inline-block bg-secondary/20 border border-secondary/50 text-secondary px-5 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
              District 20-R2 &bull; Established 2026 &bull; New York, USA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-4"
          >
            Albany Capital Region
            <br />
            <span className="text-secondary">Lions Club</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-1.5 w-32 bg-secondary mx-auto mb-4 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-6 max-w-2xl mx-auto mb-4"
          >
            <p className="text-xl md:text-2xl text-white font-bold mb-4 tracking-wide">
              We Serve &bull; We Lead &bull; We Impact
            </p>
            <p className="text-lg text-white/95 leading-relaxed">
              A proud chapter of Lions Clubs International, serving the Albany and Schenectady communities with vision, purpose, and heart.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            <Link href="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 py-6 shadow-lg shadow-secondary/30" data-testid="hero-join-button">
                Join Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-base px-8 py-6 shadow-lg" data-testid="hero-donate-button">
                Donate
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/15 font-bold text-base px-8 py-6" data-testid="hero-contact-button">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary py-8 border-y-4 border-secondary/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1.4M+", label: "Lions Worldwide" },
              { value: "48,000+", label: "Clubs Globally" },
              { value: "200+", label: "Countries & Territories" },
              { value: "2026", label: "Chartered in Albany" },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} data-testid={`stat-${i}`}>
                <div className="text-3xl md:text-4xl font-black text-secondary-foreground">{stat.value}</div>
                <div className="text-sm font-semibold text-secondary-foreground/70 uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Purpose</span>
              <h2 className="text-4xl md:text-5xl font-black text-primary mt-3 mb-6 leading-tight">
                A New Force for Good<br />in the Capital Region
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {missionStatement}
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold" data-testid="mission-learn-more">
                  Learn About Us <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mt-3">Areas of Service</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area, i) => {
              const Icon = iconMap[area.icon] || Heart;
              return (
                <motion.div key={area.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  data-testid={`service-area-${i}`}
                  className="bg-card border border-card-border rounded-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-all">
                    <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{area.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dignitaries / Recognition */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Recognized By</span>
            <h2 className="text-4xl font-black text-primary mt-3">Distinguished Recognition</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Our Charter Night &amp; Installation Ceremony was honored with messages from government leaders and Lions Clubs International leadership.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {dignitaries.map((d, i) => {
              const photo = d.photo ? dignitaryPhotoMap[d.photo] : null;
              const clickable = !!(d.fullMessage || photo);
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  data-testid={`dignitary-${i}`}
                  onClick={() => clickable && setSelectedIndex(i)}
                  className={`bg-card border border-card-border rounded-xl p-7 transition-all ${clickable ? "cursor-pointer hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5" : "hover:shadow-md hover:border-primary/20"}`}
                >
                  {photo ? (
                    <img src={photo} alt={d.name} className="w-12 h-12 rounded-full object-cover mb-3 border-2 border-secondary/40" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <UserCircle2 className="h-7 w-7 text-primary/40" />
                    </div>
                  )}
                  <Quote className="h-6 w-6 text-secondary mb-3 opacity-70" />
                  <p className="text-muted-foreground text-sm leading-relaxed italic mb-5 line-clamp-3">"{d.message}"</p>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.title}</p>
                    </div>
                    {clickable && (
                      <span className="text-xs text-primary font-semibold shrink-0">Read more →</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            <div>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Mark Your Calendar</span>
              <h2 className="text-4xl md:text-5xl font-black text-primary mt-2">Events &amp; Programs</h2>
            </div>
            <Link href="/events">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shrink-0" data-testid="events-view-all">
                View All Events <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div key={event.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                data-testid={`event-preview-${event.id}`}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="h-2 bg-secondary" />
                <div className="p-6">
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-semibold">{event.category ?? "General"}</Badge>
                  <h3 className="text-xl font-bold text-foreground mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary shrink-0" />{formatEventDate(event.eventDate)}</div>
                    {event.eventTime && (
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary shrink-0" />{event.eventTime}</div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary shrink-0" />{event.location}</div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{event.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Teaser */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm mb-4">Support Our Mission</p>
            <h3 className="text-2xl font-black text-primary mb-6">2026 Sponsorship Packages Available</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {sponsorshipTiers.filter(t => tierHighlight.includes(t.tier)).map((tier) => (
                <div key={tier.tier} className="bg-muted border border-border rounded-xl px-6 py-3 text-center" data-testid={`tier-preview-${tier.tier.toLowerCase()}`}>
                  <div className="font-black text-primary text-lg">{tier.amount}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{tier.tier}</div>
                </div>
              ))}
            </div>
            <Link href="/sponsors">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold" data-testid="sponsors-learn-more">
                View Sponsorship Packages <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
              Join fellow Lions in the Albany Capital Region and be part of something bigger than yourself. We are always welcoming new members who share our passion for service.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-10 py-6 shadow-lg shadow-secondary/30" data-testid="cta-join-button">
                  Become a Lion <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold text-base px-10 py-6" data-testid="cta-donate-button">
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dignitary Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <DignitaryModal
            dignitaries={dignitaries}
            photoMap={dignitaryPhotoMap}
            startIndex={selectedIndex}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
