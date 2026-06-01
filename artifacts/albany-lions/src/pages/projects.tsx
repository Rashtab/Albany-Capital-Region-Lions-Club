import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Users, Clock, DollarSign, Package, Loader2, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  sight: "bg-blue-100 text-blue-800 border-blue-200",
  hunger: "bg-orange-100 text-orange-900 border-orange-200",
  youth: "bg-purple-100 text-purple-800 border-purple-200",
  environment: "bg-green-100 text-green-800 border-green-200",
  diabetes: "bg-red-100 text-red-800 border-red-200",
  disaster_relief: "bg-yellow-100 text-yellow-900 border-yellow-200",
  community: "bg-primary/10 text-primary border-primary/20",
};

const FILTER_COLORS: Record<string, string> = {
  sight: "border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100",
  hunger: "border-orange-400 text-orange-800 bg-orange-50 hover:bg-orange-100",
  youth: "border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100",
  environment: "border-green-500 text-green-700 bg-green-50 hover:bg-green-100",
  diabetes: "border-red-400 text-red-700 bg-red-50 hover:bg-red-100",
  disaster_relief: "border-yellow-400 text-yellow-800 bg-yellow-50 hover:bg-yellow-100",
  community: "border-primary text-primary bg-primary/5 hover:bg-primary/10",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5 },
  }),
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function causeLabel(area: string) {
  return CAUSE_LABELS[area] ?? area.replace(/_/g, " ");
}

function causeBadge(area: string) {
  return CAUSE_BADGE[area] ?? "bg-primary/10 text-primary border-primary/20";
}

function totalImpact(metrics: ImpactMetrics | null): string | null {
  if (!metrics) return null;
  const parts: string[] = [];
  if (metrics.peopleServed) parts.push(`${metrics.peopleServed.toLocaleString()} served`);
  if (metrics.hoursVolunteered) parts.push(`${metrics.hoursVolunteered} volunteer hrs`);
  if (metrics.fundsRaised) parts.push(`$${metrics.fundsRaised.toLocaleString()} raised`);
  if (metrics.itemsCollected) parts.push(`${metrics.itemsCollected.toLocaleString()} items`);
  return parts.slice(0, 2).join(" · ") || null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    apiFetch<Project[]>("/api/projects")
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const causeAreas = [...new Set(projects.map((p) => p.causeArea))].sort();

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.causeArea === activeFilter);

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Community Impact</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Our Projects</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto text-lg">
              From vision care clinics to food drives, see how Albany Capital Region Lions make a real difference in our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-background border-b border-border sticky top-20 z-30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                activeFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              All Projects
            </button>
            {causeAreas.map((area) => (
              <button
                key={area}
                onClick={() => setActiveFilter(area)}
                className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                  activeFilter === area
                    ? "bg-primary text-primary-foreground border-primary"
                    : `${FILTER_COLORS[area] ?? "border-border text-muted-foreground hover:border-primary hover:text-primary"}`
                }`}
              >
                {causeLabel(area)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-16 bg-muted/30 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-lg font-medium">Loading projects…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <FolderOpen className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-xl font-bold text-muted-foreground">No projects yet in this area.</p>
              <p className="text-muted-foreground mt-2">Check back soon — more projects coming!</p>
              {activeFilter !== "all" && (
                <Button variant="outline" className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setActiveFilter("all")}>
                  View All Projects
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((project, i) => {
                const featuredImg = project.gallery?.[0]?.url ?? null;
                const impact = totalImpact(project.impactMetrics);
                return (
                  <motion.article
                    key={project.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:border-primary/30 transition-all group"
                    data-testid={`project-card-${project.slug}`}
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 bg-primary/10 overflow-hidden">
                      {featuredImg ? (
                        <img
                          src={featuredImg}
                          alt={project.gallery?.[0]?.caption ?? project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <span className="text-6xl opacity-20">🦁</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${causeBadge(project.causeArea)}`}>
                        {causeLabel(project.causeArea)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {project.projectDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 text-secondary" />
                          {formatDate(project.projectDate)}
                        </div>
                      )}
                      <h2 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
                          {project.description}
                        </p>
                      )}
                      {impact && (
                        <div className="text-xs font-semibold text-secondary border-t border-border pt-3 mb-4">
                          {impact}
                        </div>
                      )}
                      <Link href={`/projects/${project.slug}`}>
                        <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold" data-testid={`project-read-more-${project.slug}`}>
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Want to Get Involved?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join our team of dedicated Lions and help us serve Albany and Schenectady through hands-on projects that make a lasting difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10">
                  Join Us <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-8">
                  Support a Project
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
