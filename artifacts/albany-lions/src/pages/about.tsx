import { motion } from "framer-motion";
import { Globe, Heart, Users, Award, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { clubInfo, serviceAreas } from "@/data/clubData";
import { Eye, Accessibility, TreePine } from "lucide-react";
import React from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Users, Heart, Globe, Accessibility, TreePine,
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: "easeOut" },
  }),
};

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Who We Are</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">About Us</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Club Description */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Club</span>
              <h2 className="text-4xl font-black text-primary mt-3 mb-6">Albany Capital Region Lions Club</h2>
              <p className="text-muted-foreground leading-relaxed mb-5 text-lg">{clubInfo.description}</p>
              <p className="text-muted-foreground leading-relaxed">
                As a chapter of Lions Clubs International, we operate under the shared mission of {clubInfo.missionStatement.toLowerCase()} Our members come from all walks of life — professionals, retirees, and young adults — united by a commitment to service.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="bg-muted/50 rounded-2xl p-8 space-y-6 border border-border">
                {[
                  { icon: Globe, label: "International Affiliation", value: clubInfo.internationalAffiliation },
                  { icon: Award, label: "District", value: clubInfo.district },
                  { icon: Users, label: "Founded Globally", value: `Since ${clubInfo.founded}` },
                  { icon: Heart, label: "Our Motto", value: `"${clubInfo.tagline}"` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4" data-testid={`about-detail-${i}`}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-semibold mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="bg-primary text-primary-foreground rounded-2xl p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-black mb-4">Our Mission</h3>
              <p className="leading-relaxed text-primary-foreground/85">{clubInfo.missionStatement}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-secondary text-secondary-foreground rounded-2xl p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-foreground/20 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-black mb-4">Our Vision</h3>
              <p className="leading-relaxed">{clubInfo.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lions Club International */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Global Family</span>
            <h2 className="text-4xl font-black text-primary mt-3">Lions Clubs International</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { value: "1.4M+", label: "Members" },
              { value: "48,000+", label: "Clubs" },
              { value: "200+", label: "Countries" },
              { value: "1917", label: "Founded" },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-6 text-center" data-testid={`lci-stat-${i}`}
              >
                <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="text-center text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Lions Clubs International is the world's largest service club organization. Founded in 1917 by Melvin Jones in Chicago, Lions has grown into a global force for humanitarian service — from vision care to disaster relief, from youth programs to hunger initiatives.
          </motion.p>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Focus</span>
            <h2 className="text-4xl font-black text-primary mt-3">Core Service Areas</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceAreas.map((area, i) => {
              const Icon = iconMap[area.icon] || Heart;
              return (
                <motion.div key={area.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-card border border-card-border rounded-xl p-7 flex gap-5 hover:border-primary/30 hover:shadow-md transition-all" data-testid={`service-${i}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{area.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Join Our Pride?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">Become a member and help us serve the Albany Capital Region community.</p>
            <Link href="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10" data-testid="about-join-cta">
                Get in Touch <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
