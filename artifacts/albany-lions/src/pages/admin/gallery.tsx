import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft, Check, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin, apiFetch, apiFetchForm, authHeaders } from "@/lib/auth";

interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  category: string | null;
  eventDate: string | null;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const CATEGORIES = ["General", "Charter Night", "Service Project", "Meeting", "Community", "Youth", "Health"];
const emptyForm = { title: "", imageUrl: "", category: "General", eventDate: "" };

export default function AdminGallery() {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!isAdmin()) navigate("/admin/login"); }, [navigate]);

  const fetchItems = useCallback(() => {
    apiFetch<GalleryItem[]>("/api/gallery").then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetchForm<{ url: string }>("/api/upload", fd);
      setForm((f) => ({ ...f, imageUrl: res.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) return;
    setSaving(true);
    try {
      await fetch(`${BASE}/api/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      setCreating(false); setForm(emptyForm); fetchItems();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this photo?")) return;
    await fetch(`${BASE}/api/gallery/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin"><button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button></Link>
        <h1 className="font-black text-lg">Gallery</h1>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {!creating ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">{items.length} photos</p>
              <Button onClick={() => setCreating(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Photo</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    className="relative group rounded-xl overflow-hidden aspect-square bg-muted">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-white text-xs font-bold text-center leading-tight mb-2">{item.title}</p>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500 rounded-lg">
                        <Trash2 className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No photos yet. Upload your first photo!</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4 max-w-lg">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-primary">Add Photo</h2>
              <button onClick={() => setCreating(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Photo title" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Upload Image *</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <div className="flex gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading…" : "Choose Image"}
                </button>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Or paste image URL"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-lg" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Event Date</label>
                <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || uploading || !form.title || !form.imageUrl} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving…" : "Add Photo"}
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
