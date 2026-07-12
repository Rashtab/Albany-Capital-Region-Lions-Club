import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import {
  ArrowLeft, Calendar, Users, Clock, DollarSign, Package, Building2,
  ImageIcon, Loader2, AlertCircle, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";

interface GalleryImage {
  url: string;
  caption?: string;
}

interface ImpactMetrics {
  peopleServed?: number;
  hoursVolunteered?: number;
  fundsRaised?: number;
  itemsCollected?: number;
  [key: string]: number | undefined;
}

interface Project {
  id: number;
  slug: string;
  title: string;
  causeArea: string;
  description: string | null;
  projectDate: string | null;
  impactMetrics: ImpactMetrics | null;
  partnerOrgs: string[] | null;
  gallery: GalleryImage[] | null;
  status: string;
}

const CAUSE_LABELS: Record<string, string> = {
  sight: "Vision Care",
  hunger: "Hunger Relief",
  youth: "Youth Programs",
  environment: "Environment",
  diabetes: "Diabetes Awareness",
  disaster_relief: "Disaster Relief",
  community: "Community Service",
};

const CAUSE_BADGE: Record<string, string> = {
  sight: "bg-blue-100 text-blue-800",
  hunger: "bg-orange-100 text-orange-900",
  youth: "bg-purple-100 text-purple-800",
  environment: "bg-green-100 text-green-800",
  diabetes: "bg-red-100 text-red-800",
  disaster_relief: "bg-yellow-100 text-yellow-900",
  community: "bg-primary/10 text-primary",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function causeLabel(area: string) {
  return CAUSE_LABELS[area] ?? area.replace(/_/g, " ");
}

function causeBadge(area: string) {
  return CAUSE_BADGE[area] ?? "bg-primary/10 text-primary";
}

interface MetricCard {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  format: (v: number) => string;
}

const METRIC_CARDS: MetricCard[] = [
  { key: "peopleServed", label: "People Served", icon: Users, format: (v) => v.toLocaleString() },
  { key: "hoursVolunteered", label: "Volunteer Hours", icon: Clock, format: (v) => v.toLocaleString() },
  { key: "fundsRaised", label: "Funds Raised", icon: DollarSign, format: (v) => `$${v.toLocaleString()}` },
  { key: "itemsCollected", label: "Items Collected", icon: Package, format: (v) => v.toLocaleString() },
];

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    apiFetch<Project>(`/api/projects/${slug}`)
      .then(setProject)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading project…</span>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h1 className="text-2xl font-black text-foreground mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">This project doesn't exist or hasn't been published yet.</p>
        <Link href="/projects">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const heroImg = project.gallery?.[0] ?? null;
  const galleryRest = project.gallery?.slice(1) ?? [];
  const metrics = project.impactMetrics ?? {};
  const activeMetrics = METRIC_CARDS.filter((m) => metrics[m.key] !== undefined && metrics[m.key]! > 0);

  return (
    <div className="flex flex-col">
      <PageMeta
        title={project.title}
        path={`/projects/${project.slug}`}
        description={project.description ?? `Learn about the "${project.title}" project by the Albany Capital Region Lions Club — serving our community through ${CAUSE_LABELS[project.causeArea] ?? "community service"}.`}
        image={project.gallery?.[0]?.url ?? null}
      />
      {/* Hero */}
      <section className="relative min-h-[42vh] flex items-end bg-primary overflow-hidden">
        {heroImg ? (
          <>
            <img
              src={heroImg.url}
              alt={heroImg.caption ?? project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-10" />
        )}
        <div className="relative z-10 container mx-auto px-4 pb-10 pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/projects">
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Projects
              </button>
            </Link>
            <div className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${causeBadge(project.causeArea)}`}>
              {causeLabel(project.causeArea)}
            </div>
            <h1 className={`text-3xl md:text-5xl font-black leading-tight mb-4 ${heroImg ? "text-white" : "text-primary-foreground"}`}>
              {project.title}
            </h1>
            {project.projectDate && (
              <div className={`flex items-center gap-2 text-sm font-medium ${heroImg ? "text-white/80" : "text-primary-foreground/80"}`}>
                <Calendar className="h-4 w-4 text-secondary" />
                {formatDate(project.projectDate)}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Description */}
      {project.description && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">About This Project</span>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Impact Metrics */}
      {activeMetrics.length > 0 && (
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Impact</span>
              <h2 className="text-3xl font-black text-primary mt-3">By the Numbers</h2>
            </motion.div>
            <div className={`grid gap-6 ${activeMetrics.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : activeMetrics.length === 2 ? "grid-cols-2 max-w-lg mx-auto" : activeMetrics.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
              {activeMetrics.map((m, i) => (
                <motion.div
                  key={m.key}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`metric-${m.key}`}
                  className="bg-card border border-card-border rounded-2xl p-8 text-center hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <m.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                    {m.format(metrics[m.key]!)}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Organizations */}
      {project.partnerOrgs && project.partnerOrgs.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Collaboration</span>
              <h2 className="text-3xl font-black text-primary mt-3 mb-8">Partner Organizations</h2>
            </motion.div>
            <div className="flex flex-wrap gap-4">
              {project.partnerOrgs.map((org, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`partner-${i}`}
                  className="flex items-center gap-3 bg-muted/60 border border-border rounded-xl px-5 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{org}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-10">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Photos</span>
              <h2 className="text-3xl font-black text-primary mt-3">Project Gallery</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  data-testid={`gallery-img-${i}`}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLightboxIdx(i)}
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("hidden");
                    }}
                  />
                  <div hidden className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 opacity-30 mb-2" />
                    <span className="text-xs opacity-50">Image unavailable</span>
                  </div>
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium line-clamp-2">{img.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && project.gallery && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={project.gallery[lightboxIdx].url}
              alt={project.gallery[lightboxIdx].caption ?? "Gallery image"}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {project.gallery[lightboxIdx].caption && (
              <p className="text-white/80 text-center mt-4 text-sm">{project.gallery[lightboxIdx].caption}</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <button
                className="text-white/60 hover:text-white font-semibold text-sm px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition-all disabled:opacity-30"
                onClick={() => setLightboxIdx((idx) => (idx! > 0 ? idx! - 1 : idx))}
                disabled={lightboxIdx === 0}
              >
                ← Prev
              </button>
              <span className="text-white/50 text-sm">{lightboxIdx + 1} / {project.gallery.length}</span>
              <button
                className="text-white/60 hover:text-white font-semibold text-sm px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition-all disabled:opacity-30"
                onClick={() => setLightboxIdx((idx) => (idx! < project.gallery!.length - 1 ? idx! + 1 : idx))}
                disabled={lightboxIdx === project.gallery.length - 1}
              >
                Next →
              </button>
            </div>
            <button
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-all"
              onClick={() => setLightboxIdx(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/projects">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" /> All Projects
            </Button>
          </Link>
          <div className="flex gap-3">
            <Link href="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                Get Involved <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                Donate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
