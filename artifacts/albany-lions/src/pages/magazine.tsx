import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, ExternalLink, ChevronLeft, ChevronRight, Loader2, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";

interface Magazine {
  id: number;
  title: string;
  year: number;
  fileUrl: string;
  description: string | null;
  isCurrent: boolean | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [selected, setSelected] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Magazine[]>("/api/magazines")
      .then((list) => {
        setMagazines(list);
        const current = list.find((m) => m.isCurrent) ?? list[0] ?? null;
        setSelected(current);
      })
      .catch(() => setMagazines([]))
      .finally(() => setLoading(false));
  }, []);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pdfUrl = selected ? `${BASE}${selected.fileUrl}` : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Publications</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Club Magazine</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
              Browse and read our club magazines — documenting milestones, member stories, and community impact.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : magazines.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-24 text-center px-4">
          <div>
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-primary mb-2">No Magazines Yet</h2>
            <p className="text-muted-foreground">Check back soon for our club publications.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Sidebar — magazine list */}
          <aside className="lg:w-72 shrink-0 bg-muted/30 border-r border-border py-8 px-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4 px-2">All Issues</h2>
            <div className="space-y-2">
              {magazines.map((mag, i) => (
                <motion.button
                  key={mag.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  onClick={() => setSelected(mag)}
                  className={`w-full text-left rounded-xl px-4 py-3.5 transition-all border ${
                    selected?.id === mag.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card border-card-border hover:border-primary/40 hover:shadow-sm text-foreground"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BookMarked className={`h-5 w-5 mt-0.5 shrink-0 ${selected?.id === mag.id ? "text-secondary" : "text-primary"}`} />
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight truncate">{mag.title}</p>
                      <p className={`text-xs mt-0.5 ${selected?.id === mag.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {mag.year}{mag.isCurrent ? " · Current" : ""}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </aside>

          {/* Main — PDF reader */}
          <main className="flex-1 flex flex-col bg-muted/10">
            {selected && pdfUrl ? (
              <>
                {/* Toolbar */}
                <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-black text-primary text-lg leading-tight">{selected.title}</h2>
                    <p className="text-xs text-muted-foreground">{selected.year} Edition{selected.isCurrent ? " · Current Issue" : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={pdfUrl} download>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </a>
                    <a href={pdfUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
                      </Button>
                    </a>
                  </div>
                </div>
                {/* PDF Embed */}
                <div className="flex-1 relative">
                  <iframe
                    key={pdfUrl}
                    src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                    className="w-full h-full min-h-[75vh] border-0"
                    title={selected.title}
                  />
                </div>
                {/* Description */}
                {selected.description && (
                  <div className="px-6 py-4 bg-card border-t border-border">
                    <p className="text-sm text-muted-foreground">{selected.description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a magazine to read</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Prev / Next navigation on small screens */}
      {magazines.length > 1 && selected && (
        <div className="lg:hidden flex border-t border-border bg-card">
          <button
            onClick={() => {
              const idx = magazines.findIndex((m) => m.id === selected.id);
              if (idx > 0) setSelected(magazines[idx - 1]);
            }}
            disabled={magazines.findIndex((m) => m.id === selected.id) === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-muted-foreground hover:text-primary disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => {
              const idx = magazines.findIndex((m) => m.id === selected.id);
              if (idx < magazines.length - 1) setSelected(magazines[idx + 1]);
            }}
            disabled={magazines.findIndex((m) => m.id === selected.id) === magazines.length - 1}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-muted-foreground hover:text-primary disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
