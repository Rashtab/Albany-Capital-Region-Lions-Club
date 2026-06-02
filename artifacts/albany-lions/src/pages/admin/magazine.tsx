import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft, Check, X, Upload, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAdminMe, adminFetch, adminFetchForm } from "@/lib/adminAuth";

interface Magazine {
  id: number; title: string; year: number; fileUrl: string;
  description: string | null; isCurrent: boolean | null;
}

const emptyForm = { title: "", year: String(new Date().getFullYear()), fileUrl: "", description: "", isCurrent: false };

export default function AdminMagazine() {
  const [, navigate] = useLocation();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAdminMe().then((m) => { if (!m) navigate("/admin/login"); });
  }, [navigate]);

  const fetchMagazines = useCallback(() => {
    adminFetch<Magazine[]>("/api/magazines").then(setMagazines).catch(() => setMagazines([])).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchMagazines(); }, [fetchMagazines]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminFetchForm<{ url: string }>("/api/upload", fd);
      setForm((f) => ({ ...f, fileUrl: res.url }));
    } catch (err) { alert(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.year || !form.fileUrl) return;
    setSaving(true);
    try {
      await adminFetch("/api/magazines", { method: "POST", body: JSON.stringify(form) });
      setCreating(false); setForm(emptyForm); fetchMagazines();
    } catch (err) { alert(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this magazine?")) return;
    await adminFetch(`/api/magazines/${id}`, { method: "DELETE" });
    fetchMagazines();
  };

  const handleSetCurrent = async (mag: Magazine) => {
    await adminFetch(`/api/magazines/${mag.id}`, { method: "PUT", body: JSON.stringify({ ...mag, isCurrent: true }) });
    fetchMagazines();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin"><button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button></Link>
        <h1 className="font-black text-lg">Magazines</h1>
      </div>
      <div className="container mx-auto px-4 max-w-3xl py-8">
        {!creating ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">{magazines.length} issues</p>
              <Button onClick={() => setCreating(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Magazine</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : (
              <div className="space-y-3">
                {magazines.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-card border border-card-border rounded-xl px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-foreground">{m.title}</h2>
                        {m.isCurrent && <span className="text-xs bg-secondary/20 text-secondary font-bold px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">{m.fileUrl}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!m.isCurrent && (
                        <button onClick={() => handleSetCurrent(m)} title="Set as current" className="p-2 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Star className="h-4 w-4 text-yellow-500" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {magazines.length === 0 && <p className="text-center text-muted-foreground py-12">No magazines yet. Add your first issue!</p>}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-primary">Add Magazine</h2>
              <button onClick={() => setCreating(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Charter Night Magazine 2026" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Year *</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Upload PDF *</label>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <div className="flex gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading…" : "Choose PDF"}
                </button>
                <input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="Or paste URL"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
              </div>
              {form.fileUrl && <p className="text-xs text-green-600 mt-1 font-mono">✓ {form.fileUrl}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" placeholder="Brief description of this issue..." />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })} className="rounded" />
              Mark as current issue
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || uploading || !form.title || !form.year || !form.fileUrl} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving…" : "Add Magazine"}
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
