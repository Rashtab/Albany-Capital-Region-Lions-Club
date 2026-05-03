import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Calendar, Tag, ArrowLeft, Loader2 } from "lucide-react";
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
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {post.coverImageUrl && (
        <div className="h-64 md:h-80 overflow-hidden">
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag className="h-3 w-3" /> {post.category}
              </span>
            )}
            {post.publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-secondary pl-4 italic">{post.excerpt}</p>
          )}

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 text-foreground/90">{para}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
