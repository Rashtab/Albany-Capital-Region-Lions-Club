import { Link } from "wouter";
import { motion } from "framer-motion";
import { Eye, Users, Heart, Globe, Accessibility, TreePine, ChevronRight, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clubInfo, events, serviceAreas, sponsors } from "@/data/clubData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Users,
  Heart,
  Globe,
  Accessibility,
  TreePine,
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" },
  }),
};

const tierColors: Record<string, string> = {
  Platinum: "bg-slate-200 text-slate-800 border-slate-300",
  Gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Silver: "bg-gray-100 text-gray-700 border-gray-300",
  Community: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-primary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(48 95% 52%) 0%, transparent 60%), radial-gradient(circle at 80% 20%, hsl(221 89% 55%) 0%, transparent 50%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-secondary/20 border border-secondary/40 text-secondary px-5 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-8">
              {clubInfo.district} &bull; Serving Since {clubInfo.founded}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-4"
          >
            Albany Capital Region
            <br />
            <span className="text-secondary">Lions Club</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="h-1.5 w-32 bg-secondary mx-auto mb-8 rounded-full"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {clubInfo.fullTagline}. A proud chapter of Lions Clubs International, rooted in the Capital Region for over a century.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 py-6 shadow-lg shadow-secondary/30"
                data-testid="hero-join-button"
              >
                Join Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-base px-8 py-6"
                data-testid="hero-donate-button"
              >
                Donate
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 font-bold text-base px-8 py-6"
                data-testid="hero-contact-button"
              >
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
              { value: "107+", label: "Years of Service" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`stat-${i}`}
              >
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Purpose</span>
              <h2 className="text-4xl md:text-5xl font-black text-primary mt-3 mb-6 leading-tight">
                More Than a Club.<br />A Community Force.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {clubInfo.missionStatement}
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
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mt-3">Areas of Service</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area, i) => {
              const Icon = iconMap[area.icon] || Heart;
              return (
                <motion.div
                  key={area.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`service-area-${i}`}
                  className="bg-card border border-card-border rounded-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{area.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Mark Your Calendar</span>
              <h2 className="text-4xl md:text-5xl font-black text-primary mt-2">Upcoming Events</h2>
            </div>
            <Link href="/events">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shrink-0" data-testid="events-view-all">
                View All Events <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event, i) => (
              <motion.div
                key={event.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`event-preview-${event.id}`}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="h-2 bg-secondary" />
                <div className="p-6">
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-semibold">{event.category}</Badge>
                  <h3 className="text-xl font-bold text-foreground mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary shrink-0" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Teaser */}
      <section className="py-16 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm mb-6">Thank You to Our Community Sponsors</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {sponsors.map((s) => (
                <Badge
                  key={s.id}
                  className={`text-sm px-4 py-2 border font-semibold ${tierColors[s.tier] || "bg-muted text-muted-foreground"}`}
                  data-testid={`sponsor-badge-${s.id}`}
                >
                  {s.name} — {s.tier}
                </Badge>
              ))}
            </div>
            <Link href="/sponsors">
              <Button variant="link" className="text-primary font-semibold" data-testid="sponsors-learn-more">
                View All Sponsors <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
              Join fellow Lions in the Albany Capital Region and be part of something bigger than yourself. No experience needed — just a heart to serve.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-10 py-6 shadow-lg shadow-secondary/30"
                  data-testid="cta-join-button"
                >
                  Become a Lion <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-bold text-base px-10 py-6"
                  data-testid="cta-donate-button"
                >
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
