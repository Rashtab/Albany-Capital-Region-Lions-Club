import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sponsorshipTiers, magazineAds, clubInfo } from "@/data/clubData";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ChevronRight, FileText } from "lucide-react";
import { apiFetch } from "@/lib/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const tierStyles: Record<string, { card: string; badge: string; amount: string; border: string }> = {
  Platinum: {
    card: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300",
    badge: "bg-slate-200 text-slate-800",
    amount: "text-slate-700",
    border: "border-slate-300",
  },
  Gold: {
    card: "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300",
    badge: "bg-yellow-200 text-yellow-900",
    amount: "text-yellow-700",
    border: "border-yellow-300",
  },
  Silver: {
    card: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300",
    badge: "bg-gray-200 text-gray-800",
    amount: "text-gray-600",
    border: "border-gray-300",
  },
  Bronze: {
    card: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300",
    badge: "bg-orange-200 text-orange-900",
    amount: "text-orange-700",
    border: "border-orange-300",
  },
  Community: {
    card: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    amount: "text-blue-700",
    border: "border-blue-200",
  },
  Friend: {
    card: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    badge: "bg-green-100 text-green-800",
    amount: "text-green-700",
    border: "border-green-200",
  },
};

function capitalizeTier(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

interface DbSponsor {
  id: number;
  name: string;
  tier: string;
  logoUrl: string | null;
  website: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  sortOrder: number | null;
  status: string | null;
}

export default function Sponsors() {
  const [dbSponsors, setDbSponsors] = useState<DbSponsor[]>([]);
  const [contactEmail, setContactEmail] = useState(clubInfo.email);
  const [contactPhone, setContactPhone] = useState(clubInfo.phone);

  useEffect(() => {
    apiFetch<DbSponsor[]>("/api/sponsors")
      .then(setDbSponsors)
      .catch(() => {});

    apiFetch<Record<string, string>>("/api/site-settings")
      .then((data) => {
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.contact_phone) setContactPhone(data.contact_phone);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">2026 Packages</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Sponsorship &amp; Advertising</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto text-lg">
              "Our sponsors do not simply fund an organization. They invest in Albany's future."
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Sponsoring */}
      <section className="py-16 bg-secondary border-y-4 border-secondary/80">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl font-black text-secondary-foreground">Partner With Us to Serve the Capital Region</h2>
            <p className="text-secondary-foreground/80 mt-3 max-w-2xl mx-auto">
              Sponsoring the Albany Capital Region Lions Club connects your business with a mission-driven community organization committed to vision care, youth programs, hunger relief, and humanitarian service across Albany and Schenectady.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Investment Levels</span>
            <h2 className="text-4xl font-black text-primary mt-3">Sponsorship Packages</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsorshipTiers.map((tier, i) => {
              const style = tierStyles[tier.tier] || tierStyles["Community"];
              return (
                <motion.div
                  key={tier.tier}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`tier-card-${tier.tier.toLowerCase()}`}
                  className={`rounded-2xl border-2 p-8 flex flex-col hover:shadow-lg transition-all ${style.card}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${style.badge}`}>
                      {tier.tier}
                    </span>
                  </div>
                  <div className={`text-4xl font-black mb-6 ${style.amount}`}>{tier.amount}</div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {tier.benefits.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${style.amount}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href={`mailto:${contactEmail}?subject=Sponsorship Inquiry — ${tier.tier} Package`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" data-testid={`tier-cta-${tier.tier.toLowerCase()}`}>
                      Inquire About {tier.tier}
                    </Button>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      {dbSponsors.length > 0 && (
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Partners</span>
              <h2 className="text-3xl font-black text-primary mt-3">Current Sponsors</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dbSponsors.map((sponsor, i) => {
                const displayTier = capitalizeTier(sponsor.tier);
                const style = tierStyles[displayTier] || tierStyles["Community"];
                return (
                  <motion.div key={sponsor.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className={`rounded-xl border-2 p-7 ${style.card}`} data-testid={`sponsor-card-${sponsor.id}`}
                  >
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${style.badge} mb-3 inline-block`}>{displayTier}</span>
                    <h4 className="text-xl font-bold text-foreground mt-2">{sponsor.name}</h4>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline mt-1 inline-block"
                      >
                        {sponsor.website}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Magazine Advertising */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Print Advertising</span>
            <h2 className="text-3xl font-black text-primary mt-3">Magazine &amp; Brochure Advertising</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Advertise in our club magazine and reach engaged community members, Lions families, and local civic leaders.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {magazineAds.map((ad, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-8 text-center hover:shadow-md hover:border-primary/30 transition-all" data-testid={`ad-type-${i}`}
              >
                <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-black text-foreground mb-1">{ad.type}</h3>
                <div className="text-3xl font-black text-secondary my-3">{ad.price}</div>
                <p className="text-sm text-muted-foreground">{ad.details}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="text-center">
            <Link href="/sponsors/magazine-advertisers-2026">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8" data-testid="view-magazine-advertisers">
                View Magazine Advertisers 2026 <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-4xl font-black text-white mb-5">Ready to Partner With Us?</h2>
            <p className="text-primary-foreground/80 text-lg mb-4 leading-relaxed">
              Contact us to receive the full 2026 Sponsorship &amp; Advertising Package and discuss how we can best showcase your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <a href={`mailto:${contactEmail}?subject=Sponsorship Inquiry 2026`}>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10" data-testid="sponsor-email-cta">
                  Email Us Now <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-8" data-testid="sponsor-contact-cta">
                  Contact Form
                </Button>
              </Link>
            </div>
            <p className="text-primary-foreground/60 text-sm">{contactEmail} &bull; {contactPhone}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
