import { motion } from "framer-motion";
import { officers } from "@/data/clubData";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.toLowerCase() !== "lion")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-muted-foreground",
  "bg-accent text-accent-foreground",
];

export default function Leadership() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Meet the Team</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Club Leadership</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Leadership Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl font-black text-primary">Your 2024–2025 Officers</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Our dedicated leadership team works tirelessly to guide our club's mission and serve the Capital Region community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {officers.map((officer, i) => (
              <motion.div
                key={officer.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`officer-card-${officer.id}`}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col"
              >
                <div className="h-1.5 bg-secondary" />
                <div className="p-6 flex flex-col items-center text-center flex-1">
                  {officer.photo ? (
                    <img
                      src={officer.photo}
                      alt={officer.name}
                      className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-secondary/30"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-4 border-4 border-secondary/30 ${avatarColors[i % avatarColors.length]}`}
                    >
                      {getInitials(officer.name)}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-1">{officer.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs mb-3">
                    {officer.title}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{officer.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={officers.length}
            className="mt-14 bg-muted/50 border border-border rounded-xl p-6 flex gap-4 items-start max-w-2xl mx-auto"
            data-testid="leadership-disclaimer"
          >
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Officer information is updated annually. Contact us for the most current leadership roster. Officer names marked as placeholders will be updated once confirmed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Do Officers Do */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Club Structure</span>
            <h2 className="text-3xl font-black text-primary mt-3">How We Operate</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Monthly Meetings", desc: "Officers lead regular club meetings to plan service projects, review finances, and celebrate member achievements." },
              { title: "Committee Leadership", desc: "Each officer chairs or participates in service committees — from vision care to youth programs and community outreach." },
              { title: "District Coordination", desc: "Club officers connect with District 20-Y1 leadership and Lions Clubs International to align with global service priorities." },
              { title: "Member Engagement", desc: "Leadership focuses on growing membership, retaining members, and recognizing outstanding service throughout the year." },
            ].map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-7 hover:border-primary/30 transition-all" data-testid={`ops-card-${i}`}
              >
                <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
