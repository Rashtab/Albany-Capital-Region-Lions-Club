import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { Heart, AlertTriangle, CheckCircle2, ChevronRight, Mail, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { donationInfo, clubInfo, sponsorshipTiers } from "@/data/clubData";
import { ZeffyDonateEmbed, ZeffyQRCode, ZeffyNotice } from "@/components/zeffy-donate";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const impactItems = [
  { amount: "$25", impact: "Provides a pair of eyeglasses for someone in need" },
  { amount: "$50", impact: "Funds a youth scholarship application review" },
  { amount: "$100", impact: "Supports a family food basket at our community drive" },
  { amount: "$250", impact: "Sponsors a vision screening event for 25 people" },
  { amount: "$500", impact: "Underwrites a full community service project" },
  { amount: "$1,000+", impact: "Becomes a named sponsor for a Lions Club event" },
];

export default function Donate() {
  return (
    <div className="flex flex-col">
      <PageMeta
        title="Donate & Support"
        path="/donate"
        description="Support the Albany Capital Region Lions Club with a tax-deductible donation. Your gift funds vision care, hunger relief, youth programs, and community service in Albany and Schenectady."
      />
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Make a Difference</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Donate &amp; Support</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-xl mx-auto">
              Your generosity powers our service to the Albany Capital Region. Every contribution matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Online Donation — Zeffy Embed */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Donate Online</span>
            <h2 className="text-4xl font-black text-primary mt-3">Give Securely &amp; Instantly</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Use the form below to make a one-time or recurring donation by card, Apple Pay, or Google Pay — powered by Zeffy with zero platform fees.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <ZeffyDonateEmbed />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mt-4">
            <ZeffyNotice />
          </motion.div>

          {/* QR code — mobile / other device */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-6 bg-muted/40 border border-border rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <ZeffyQRCode className="shrink-0" />
          </motion.div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Your Impact</span>
            <h2 className="text-4xl font-black text-primary mt-3">What Your Donation Does</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactItems.map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                data-testid={`impact-item-${i}`}
                className="bg-card border border-card-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="text-3xl font-black text-secondary mb-3">{item.amount}</div>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Payment Methods */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Other Ways to Give</span>
            <h2 className="text-3xl font-black text-primary mt-3">Additional Payment Methods</h2>
          </motion.div>

          <div className="space-y-6">
            {/* Check */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-card border border-card-border rounded-xl p-8" data-testid="donate-check"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">By Check</h3>
                  <p className="text-muted-foreground mb-1">Make check payable to:</p>
                  <p className="text-foreground font-black text-lg mb-2">{donationInfo.checkPayable}</p>
                  <p className="text-muted-foreground">Mail to: <span className="text-foreground font-medium">{donationInfo.mailingAddress}</span></p>
                </div>
              </div>
            </motion.div>

            {/* Zelle */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="bg-card border border-card-border rounded-xl p-8" data-testid="donate-zelle"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Via Zelle</h3>
                  <p className="text-muted-foreground mb-1">Send to:</p>
                  <p className="text-foreground font-semibold">{donationInfo.zelle}</p>
                </div>
              </div>
            </motion.div>

            {/* Contact for other */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
              className="bg-card border border-card-border rounded-xl p-8" data-testid="donate-contact"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Contact Us Directly</h3>
                  <p className="text-muted-foreground mb-3">For other payment arrangements or to discuss major gifts:</p>
                  <div className="flex flex-wrap gap-4">
                    <a href={`mailto:${clubInfo.email}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                      <Mail className="h-4 w-4" /> {clubInfo.email}
                    </a>
                    <a href={`tel:${clubInfo.phone}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                      <Phone className="h-4 w-4" /> {clubInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
              className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 items-start" data-testid="donate-disclaimer"
            >
              <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Important Notice</h4>
                <p className="text-amber-700 leading-relaxed text-sm">{donationInfo.disclaimer}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Preview */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Business Support</span>
            <h2 className="text-3xl font-black text-primary mt-3">Corporate &amp; Business Sponsorship</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              We offer six sponsorship tiers for businesses of all sizes — from $100 Friend sponsorships to $10,000+ Platinum packages.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {sponsorshipTiers.map((tier, i) => (
              <motion.div key={tier.tier} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all" data-testid={`donate-tier-${tier.tier.toLowerCase()}`}
              >
                <div className="font-black text-primary text-xl">{tier.amount}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{tier.tier}</div>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={sponsorshipTiers.length}
            className="text-center"
          >
            <Link href="/sponsors">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10" data-testid="donate-view-packages">
                View Full Sponsorship Packages <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
