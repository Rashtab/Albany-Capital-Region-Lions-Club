import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Calendar, Tag, ArrowLeft, Loader2, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  authorName: string | null;
  tags: string[] | null;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    setNotFound(false);
    apiFetch<BlogPost>(`/api/blog/${params.slug}`)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-black text-primary mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">This post doesn't exist or hasn't been published yet.</p>
        <Link href="/blog">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Cover image hero */}
      {post.coverImageUrl && (
        <div className="w-full max-h-[480px] overflow-hidden bg-muted flex items-center justify-center">
          <img src={post.coverImageUrl} alt={post.title} className="w-full max-h-[480px] object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          {/* Category + date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="h-3 w-3" /> {post.category}
              </span>
            )}
            {post.publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-5 leading-tight">{post.title}</h1>

          {/* Author */}
          {post.authorName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span>By <span className="font-semibold text-foreground">{post.authorName}</span></span>
            </div>
          )}

          {/* Excerpt / pull quote */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-secondary pl-5 italic">
              {post.excerpt}
            </p>
          )}

          {/* Body content */}
          <div className="space-y-4">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed text-[1.05rem]">{para}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/blog">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                <ArrowLeft className="mr-2 h-4 w-4" /> All Posts
              </Button>
            </Link>
            <div className="flex gap-3">
              <Link href="/contact">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                  Get Involved
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
