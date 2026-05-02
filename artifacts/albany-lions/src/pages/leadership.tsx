import { motion } from "framer-motion";
import { officers, directors, executiveMembers } from "@/data/clubData";
import { Badge } from "@/components/ui/badge";
import { Info, Phone } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-primary/80 text-primary-foreground",
  "bg-secondary/80 text-secondary-foreground",
  "bg-primary/60 text-primary-foreground",
];

export default function Leadership() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Charter Committee</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Club Leadership</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
              Meet the founding leadership team of the Albany Capital Region Lions Club — dedicated professionals united by a passion for service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Executive Committee */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Executive Committee</span>
            <h2 className="text-3xl font-black text-primary mt-2">Charter Officers</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {officers.map((officer, i) => (
              <motion.div
                key={officer.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`officer-card-${officer.id}`}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="h-1.5 bg-secondary" />
                <div className="p-6 flex flex-col items-center text-center flex-1">
                  {officer.photo ? (
                    <img src={officer.photo} alt={officer.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-secondary/30" />
                  ) : (
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-secondary/30 ${avatarColors[i % avatarColors.length]}`}>
                      {getInitials(officer.name)}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-1">{officer.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs mb-3">
                    {officer.title}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{officer.bio}</p>
                  {officer.phone && (
                    <a href={`tel:${officer.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-auto" data-testid={`officer-phone-${officer.id}`}>
                      <Phone className="h-3.5 w-3.5" /> {officer.phone}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Directors */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Board</span>
            <h2 className="text-3xl font-black text-primary mt-2">Directors</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {directors.map((d, i) => (
              <motion.div key={d.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all" data-testid={`director-${d.id}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3 border-2 border-secondary/30 ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(d.name)}
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{d.name}</p>
                {d.phone && <p className="text-xs text-muted-foreground mt-1">{d.phone}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Members */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Team</span>
            <h2 className="text-3xl font-black text-primary mt-2">Executive Members</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {executiveMembers.map((m, i) => (
              <motion.div key={m.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all" data-testid={`exec-member-${m.id}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3 border-2 border-secondary/30 ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(m.name)}
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{m.name}</p>
                {m.phone && <p className="text-xs text-muted-foreground mt-1">{m.phone}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="bg-muted/50 border border-border rounded-xl p-6 flex gap-4 items-start" data-testid="leadership-disclaimer"
          >
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leadership reflects the founding Charter Committee of the Albany Capital Region Lions Club (2026). For the most current roster, please contact the club directly.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
