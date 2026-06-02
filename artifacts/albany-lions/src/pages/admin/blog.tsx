import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, Check, X, Eye, EyeOff, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAdminMe, adminFetch, adminFetchForm } from "@/lib/adminAuth";

interface BlogPost {
  id: number; title: string; slug: string; content: string;
  excerpt: string | null; coverImageUrl: string | null;
  category: string | null; published: boolean; publishedAt: string | null; createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const CATEGORIES = ["News", "Events", "Community", "Health", "Youth", "Announcements"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm = { title: "", slug: "", content: "", excerpt: "", coverImageUrl: "", category: "News", published: false };

export default function AdminBlog() {
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAdminMe().then((m) => { if (!m) navigate("/admin/login"); });
  }, [navigate]);

  const fetchPosts = useCallback(() => {
    adminFetch<BlogPost[]>("/api/blog/all").then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); };
  const openEdit = (p: BlogPost) => {
    setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt ?? "", coverImageUrl: p.coverImageUrl ?? "", category: p.category ?? "News", published: p.published });
    setEditing(p); setCreating(true);
  };

  const handleCoverUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminFetchForm<{ url: string }>("/api/upload", fd);
      setForm((f) => ({ ...f, coverImageUrl: res.url }));
    } catch (err) { alert(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) return;
    setSaving(true);
    try {
      if (editing) {
        await adminFetch(`/api/blog/${editing.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await adminFetch("/api/blog", { method: "POST", body: JSON.stringify(form) });
      }
      setCreating(false); setEditing(null); fetchPosts();
    } catch (err) { alert(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await adminFetch(`/api/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin"><button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button></Link>
        <h1 className="font-black text-lg">Blog Posts</h1>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {!creating ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">{posts.length} posts</p>
              <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : (
              <div className="space-y-3">
                {posts.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-card border border-card-border rounded-xl px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {p.coverImageUrl ? (
                        <img src={p.coverImageUrl} alt={p.title} className="h-12 w-16 object-cover rounded-lg shrink-0 border border-border" />
                      ) : (
                        <div className="h-12 w-16 rounded-lg bg-muted border border-dashed border-border shrink-0 flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-foreground truncate">{p.title}</h2>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${p.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {p.published ? "Published" : "Draft"}
                          </span>
                          {p.category && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{p.category}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">/blog/{p.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </motion.div>
                ))}
                {posts.length === 0 && <p className="text-center text-muted-foreground py-12">No posts yet. Create your first post!</p>}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-primary">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => { setCreating(false); setEditing(null); }}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
                <input value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Post title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="post-url-slug" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Excerpt</label>
              <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Short summary shown in listings" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Cover Image / Photo</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading…" : "Upload Image"}
                </button>
                <input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="Or paste image URL"
                  className="flex-1 min-w-0 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {form.coverImageUrl ? (
                <div className="mt-2 relative inline-block">
                  <img src={form.coverImageUrl} alt="Cover preview" className="h-32 w-auto max-w-xs rounded-lg border border-border object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, coverImageUrl: "" })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2 h-16 w-24 bg-muted rounded-lg border border-dashed border-border justify-center">
                  <Image className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Content *</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono" placeholder="Full post content (use double line breaks for paragraphs)" />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-32">
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setForm({ ...form, published: !form.published })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${form.published ? "bg-green-50 border-green-200 text-green-700" : "bg-muted border-border text-muted-foreground"}`}>
                {form.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {form.published ? "Published" : "Draft"}
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || uploading || !form.title || !form.slug || !form.content} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving…" : "Save Post"}
              </Button>
              <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
