import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { officers, directors, executiveMembers, newMembers } from "@/data/clubData";
import { Badge } from "@/components/ui/badge";
import { Info, Phone, X, ZoomIn } from "lucide-react";
import charterPhoto from "@assets/IMG_2594_1777764422490.jpeg";

// ── Member photos ────────────────────────────────────────────
import photoAbdusSalam from "@assets/Abdus_Salam_1777729404919.jpeg";
import photoAdityaShaheen from "@assets/Aditya_Shaheen_1777729404920.jpeg";
import photoAnikaSubah from "@assets/Anika_Subah_Ahmed_1777729404920.jpeg";
import photoDewanSarowar from "@assets/Dewan_A_Sarowar_1777729404920.jpeg";
import photoHenryRashid from "@assets/Henry_Rashid_1777729404920.jpeg";
import photoLailaKhaleda from "@assets/Laila_Khaleda_1777729404921.jpeg";
import photoMaksudulHasanKhan from "@assets/Maksudul_Hasan_Khan_1777729404921.jpeg";
import photoMarzanaKhandoker from "@assets/Marzana_Khandoker_1777729412560.jpeg";
import photoMontasinaHaider from "@assets/Montasina_Haider_1777729412560.jpeg";
import photoMoshfaqAhmedAsif from "@assets/Moshfaq_Ahmed_Asif_1777729412561.jpeg";
import photoMossaNurunnahar from "@assets/Mossa._Nurunnahar_1777729412561.jpeg";
import photoNadiraMujumdar from "@assets/Nadira_Mujumdar_1777729412561.jpeg";
import photoNusratSharmin from "@assets/Nusrat_Sharmin_1777729412562.jpeg";
import photoQuaziMahtab from "@assets/Quazi_Mahtab_Uddin_1777729412562.jpeg";
import photoRashtabMahmud from "@assets/Rashtab_Mahmud_1777729510381.jpeg";
import photoSajedurAkanda from "@assets/Sajedur_Akanda_1777729510381.jpeg";
import photoShanazMashud from "@assets/Shanaz_Mashud_1777729510381.jpeg";
import photoTahminaSonia from "@assets/Tahmina_Sharif_Sonia_1777729510381.jpeg";
import photoTaniaZaman from "@assets/Tania_Zaman_1777729510382.jpeg";
import photoTofazzalHossain from "@assets/Tofazzal_Hossain_1777729510382.jpeg";
import photoZakiaNizam from "@assets/Zakia_Nizam_1777729510382.jpeg";
import photoFarhanaIslam from "@assets/Farhana_Islam_cropped.jpeg";
import photoNasimaAkterNisha from "@assets/Nasima_Akter_Nisha_cropped.jpeg";

// Map member names to their photos
const photoMap: Record<string, string> = {
  "Abdus Salam": photoAbdusSalam,
  "Aditya Shaheen": photoAdityaShaheen,
  "Anika Subah Ahmad Upoma": photoAnikaSubah,
  "Dewan A Sarowar": photoDewanSarowar,
  "Henry Rashid": photoHenryRashid,
  "Laila Khaleda": photoLailaKhaleda,
  "Maksudul Hasan Khan": photoMaksudulHasanKhan,
  "Marzana Khandoker": photoMarzanaKhandoker,
  "Montasina Haider": photoMontasinaHaider,
  "Moshfaq Ahmed Asif": photoMoshfaqAhmedAsif,
  "Mossa. Nurrunnahar": photoMossaNurunnahar,
  "Nadira Mujumdar": photoNadiraMujumdar,
  "Nusrat Sharmin": photoNusratSharmin,
  "Quazi Mahtab Uddin": photoQuaziMahtab,
  "Rashtab Mahmud": photoRashtabMahmud,
  "Sajedur Akanda": photoSajedurAkanda,
  "Shanaz Mashud": photoShanazMashud,
  "Tahmina Sharif Sonia": photoTahminaSonia,
  "Tania Zaman": photoTaniaZaman,
  "Tofazzal Hossain": photoTofazzalHossain,
  "Zakia Nizam": photoZakiaNizam,
  "Farhana Islam": photoFarhanaIslam,
  "Nasima Akter Nisha": photoNasimaAkterNisha,
};

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

function MemberPhoto({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const photo = photoMap[name];
  const sizeClass = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const textClass = size === "lg" ? "text-2xl" : "text-sm";
  const borderClass = size === "lg" ? "border-4" : "border-2";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeClass} rounded-full object-cover object-top ${borderClass} border-secondary/30 mb-4 mx-auto`}
      />
    );
  }

  const colorIndex = name.charCodeAt(0) % avatarColors.length;
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center ${textClass} font-black mb-4 mx-auto ${borderClass} border-secondary/30 ${avatarColors[colorIndex]}`}>
      {getInitials(name)}
    </div>
  );
}

export default function Leadership() {
  const [charterOpen, setCharterOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Charter Photo Lightbox */}
      <AnimatePresence>
        {charterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setCharterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCharterOpen(false)}
                className="absolute -top-4 -right-4 z-10 bg-white text-primary rounded-full p-1.5 shadow-lg hover:bg-secondary hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={charterPhoto}
                alt="Charter Members Executive Committee — Albany Capital Region Lions Club"
                className="w-full rounded-2xl shadow-2xl"
              />
              <p className="text-center text-white/70 text-sm mt-3">
                Charter Members Executive Committee · Albany Capital Region Lions Club · District 20-R2, NY
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Charter Members Executive Committee — Featured Photo */}
      <section className="py-20 bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="lg:w-1/2 shrink-0"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-secondary/40 cursor-pointer group"
                onClick={() => setCharterOpen(true)}
              >
                <img
                  src={charterPhoto}
                  alt="Charter Members Executive Committee — Albany Capital Region Lions Club"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                    <ZoomIn className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent px-6 py-5">
                  <p className="text-white font-black text-base leading-tight">Charter Members Executive Committee</p>
                  <p className="text-secondary text-xs font-semibold mt-0.5">Albany Capital Region Lions Club · District 20-R2, New York, USA</p>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <ZoomIn className="h-3.5 w-3.5" /> Click image to enlarge
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="lg:w-1/2"
            >
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Founding Leaders</span>
              <h2 className="text-4xl font-black text-primary mt-3 mb-5 leading-tight">
                Charter Members<br />Executive Committee
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5 text-lg">
                These dedicated individuals are the founding members of the Albany Capital Region Lions Club — professionals, educators, community leaders, and visionaries who came together in 2026 to establish a new force for service in the Capital Region.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As charter members, they have committed to building a club that lives by the Lions motto: <em className="text-primary font-semibold">We Serve.</em> Their leadership and sacrifice in launching this club will be remembered as part of its history for generations to come.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Officers", "Directors", "Executive Members", "New Members"].map((label) => (
                  <span key={label} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
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
                  <MemberPhoto name={officer.name} size="lg" />
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
                <MemberPhoto name={d.name} size="sm" />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {executiveMembers.map((m, i) => (
              <motion.div key={m.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all" data-testid={`exec-member-${m.id}`}
              >
                <MemberPhoto name={m.name} size="sm" />
                <p className="text-sm font-bold text-foreground leading-tight">{m.name}</p>
                {m.phone && <p className="text-xs text-muted-foreground mt-1">{m.phone}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Members */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Growing Our Pride</span>
            <h2 className="text-3xl font-black text-primary mt-2">New Members</h2>
          </motion.div>
          <div className="flex justify-center gap-4 flex-wrap">
            {newMembers.map((m, i) => (
              <motion.div key={m.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-card-border rounded-xl p-5 text-center hover:border-secondary/50 hover:shadow-md transition-all w-40" data-testid={`new-member-${m.id}`}
              >
                <div className="relative mx-auto w-14 h-14 mb-4">
                  <MemberPhoto name={m.name} size="sm" />
                  <span className="absolute -bottom-1 -right-1 bg-secondary text-[10px] font-black text-secondary-foreground px-1.5 py-0.5 rounded-full leading-none">NEW</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{m.name}</p>
                {m.phone && <p className="text-xs text-muted-foreground mt-1">{m.phone}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-16 bg-muted/40">
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
