import { motion } from "framer-motion";
import { sponsors, clubInfo } from "@/data/clubData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star, Building2, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const tierConfig: Record<string, { color: string; badge: string; stars: number }> = {
  Platinum: { color: "border-slate-300 bg-slate-50", badge: "bg-slate-200 text-slate-800 border-slate-300", stars: 4 },
  Gold: { color: "border-yellow-300 bg-yellow-50", badge: "bg-yellow-100 text-yellow-800 border-yellow-300", stars: 3 },
  Silver: { color: "border-gray-300 bg-gray-50", badge: "bg-gray-100 text-gray-700 border-gray-300", stars: 2 },
  Community: { color: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-800 border-blue-200", stars: 1 },
};

const sponsorTiers = ["Platinum", "Gold", "Silver", "Community"];

export default function Sponsors() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Community Partners</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Sponsors &amp; Magazine</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-xl mx-auto">
              Our work is made possible by the generous support of local businesses and community partners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Thank You Banner */}
      <section className="py-12 bg-secondary border-y-4 border-secondary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl font-black text-secondary-foreground">Thank You to Our Generous Sponsors</h2>
            <p className="text-secondary-foreground/80 mt-2">Your support makes our service to the Albany Capital Region possible.</p>
          </motion.div>
        </div>
      </section>

      {/* Sponsor Grid by Tier */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {sponsorTiers.map((tier, ti) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;
            const config = tierConfig[tier] || tierConfig["Community"];
            return (
              <motion.div key={tier} custom={ti} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="mb-16" data-testid={`sponsor-tier-${tier.toLowerCase()}`}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex gap-1">
                    {Array.from({ length: config.stars }).map((_, si) => (
                      <Star key={si} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-primary">{tier} Sponsors</h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className={`grid grid-cols-1 ${tier === "Platinum" ? "md:grid-cols-1 max-w-2xl" : "md:grid-cols-2"} gap-6`}>
                  {tierSponsors.map((sponsor, i) => (
                    <div key={sponsor.id}
                      className={`rounded-xl border-2 p-8 ${config.color} hover:shadow-md transition-all`}
                      data-testid={`sponsor-card-${sponsor.id}`}
                    >
                      <div className="flex items-start gap-4">
                        {sponsor.logo ? (
                          <img src={sponsor.logo} alt={sponsor.name} className="w-16 h-16 object-contain rounded-lg" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-white border-2 border-border flex items-center justify-center shrink-0">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <Badge className={`text-xs font-bold border mb-2 ${config.badge}`}>{sponsor.tier}</Badge>
                          <h4 className="text-xl font-bold text-foreground mb-1">{sponsor.name}</h4>
                          {sponsor.description && <p className="text-muted-foreground text-sm leading-relaxed">{sponsor.description}</p>}
                          {sponsor.phone && <p className="text-sm text-muted-foreground mt-2">{sponsor.phone}</p>}
                          {sponsor.address && <p className="text-sm text-muted-foreground">{sponsor.address}</p>}
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block" data-testid={`sponsor-link-${sponsor.id}`}
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Magazine Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Publication</span>
            <h2 className="text-3xl font-black text-primary mt-3">Club Magazine</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="bg-card border border-card-border rounded-2xl p-10 text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Albany Capital Region Lions Club Magazine</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-6">
              Our club magazine is published periodically and features club news, event recaps, officer updates, sponsor spotlights, and community stories. Advertising in the magazine is a great way for local businesses to support our mission while reaching our members and community.
            </p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" data-testid="magazine-advertise-cta">
                Inquire About Advertising <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Become a Sponsor */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Partner With Us</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-5">Become a Sponsor</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Sponsoring the Albany Capital Region Lions Club connects your business with a century of community service. Your investment directly funds vision care, youth programs, hunger relief, and more — while putting your brand in front of engaged community members.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
              {sponsorTiers.map((tier) => (
                <div key={tier} className="bg-white/10 rounded-xl p-4 text-center" data-testid={`tier-option-${tier.toLowerCase()}`}>
                  <div className="font-bold text-white">{tier}</div>
                  <div className="text-primary-foreground/60 text-xs mt-1">Sponsor Tier</div>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10" data-testid="become-sponsor-cta">
                Contact Us to Sponsor <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
