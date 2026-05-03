import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, Tag, ArrowRight, Loader2, PenLine } from "lucide-react";
import { apiFetch } from "@/lib/auth";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }),
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const CATEGORIES = ["All", "News", "Events", "Community", "Health", "Youth", "Announcements"];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    apiFetch<BlogPost[]>("/api/blog")
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Updates & Stories</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Club Blog</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
              News, stories, and updates from the Albany Capital Region Lions Club community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                  filter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <PenLine className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-primary mb-2">No Posts Yet</h2>
              <p className="text-muted-foreground">Check back soon for club news and stories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link href={`/blog/${post.slug}`} className="block group h-full">
                    <div className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all h-full flex flex-col">
                      {post.coverImageUrl ? (
                        <div className="overflow-hidden bg-muted flex items-center justify-center min-h-[160px] max-h-56">
                          <img src={post.coverImageUrl} alt={post.title} className="w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                          <PenLine className="h-10 w-10 text-primary/30" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Tag className="h-3 w-3" /> {post.category}
                            </span>
                          )}
                          {post.publishedAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-black text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">{post.title}</h2>
                        {post.excerpt && <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>}
                        <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold">
                          Read more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
