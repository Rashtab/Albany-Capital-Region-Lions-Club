import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, Check, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin, apiFetch, apiFetchForm, authHeaders } from "@/lib/auth";

interface CalEvent {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  location: string | null;
  category: string | null;
  registrationLink: string | null;
  posterUrl: string | null;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const CATEGORIES = ["General", "Milestone", "Health", "Community", "Youth", "Fundraiser", "Meeting"];
const emptyForm = { title: "", description: "", eventDate: "", eventTime: "", location: "", category: "General", registrationLink: "", posterUrl: "" };

export default function AdminEvents() {
  const [, navigate] = useLocation();
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CalEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!isAdmin()) navigate("/admin/login"); }, [navigate]);

  const fetchEvents = useCallback(() => {
    apiFetch<CalEvent[]>("/api/calendar").then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); };
  const openEdit = (e: CalEvent) => {
    setForm({
      title: e.title, description: e.description ?? "", eventDate: e.eventDate,
      eventTime: e.eventTime ?? "", location: e.location ?? "",
      category: e.category ?? "General", registrationLink: e.registrationLink ?? "",
      posterUrl: e.posterUrl ?? "",
    });
    setEditing(e); setCreating(true);
  };

  const handlePosterUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetchForm<{ url: string }>("/api/upload", fd);
      setForm((f) => ({ ...f, posterUrl: res.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.eventDate) return;
    setSaving(true);
    try {
      const body = JSON.stringify(form);
      const headers = { "Content-Type": "application/json", ...authHeaders() };
      if (editing) {
        await fetch(`${BASE}/api/calendar/${editing.id}`, { method: "PUT", headers, body });
      } else {
        await fetch(`${BASE}/api/calendar`, { method: "POST", headers, body });
      }
      setCreating(false); setEditing(null); fetchEvents();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`${BASE}/api/calendar/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin"><button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button></Link>
        <h1 className="font-black text-lg">Events Calendar</h1>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {!creating ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">{events.length} events</p>
              <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Event</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : (
              <div className="space-y-3">
                {events.map((e, i) => (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-card border border-card-border rounded-xl px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {e.posterUrl ? (
                        <img src={e.posterUrl} alt={e.title} className="h-12 w-10 object-cover rounded shrink-0 border border-border" />
                      ) : (
                        <div className="text-center bg-primary/10 rounded-lg px-3 py-1.5 shrink-0">
                          <p className="text-xs font-bold text-primary">{new Date(e.eventDate + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</p>
                          <p className="text-lg font-black text-primary leading-none">{new Date(e.eventDate + "T00:00:00").getDate()}</p>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="font-bold text-foreground truncate">{e.title}</h2>
                        <p className="text-xs text-muted-foreground">{e.location}{e.eventTime ? ` · ${e.eventTime}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(e)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(e.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </motion.div>
                ))}
                {events.length === 0 && <p className="text-center text-muted-foreground py-12">No events yet. Add your first event!</p>}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-primary">{editing ? "Edit Event" : "New Event"}</h2>
              <button onClick={() => setCreating(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Event title" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Date *</label>
                <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Time</label>
                <input value={form.eventTime} onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 6:00 PM" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Venue or address" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" placeholder="Event details..." />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Registration / RSVP Link</label>
              <input value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https:// or mailto:..." />
            </div>

            {/* Poster Upload */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Event Poster / Photo</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePosterUpload(f); }} />
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading…" : "Upload Poster"}
                </button>
                <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                  placeholder="Or paste image URL"
                  className="flex-1 min-w-0 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {form.posterUrl && (
                <div className="mt-2 relative inline-block">
                  <img src={form.posterUrl} alt="Poster preview" className="h-32 w-auto rounded-lg border border-border object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, posterUrl: "" })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {!form.posterUrl && (
                <div className="mt-2 flex items-center gap-2 h-16 w-24 bg-muted rounded-lg border border-dashed border-border justify-center">
                  <Image className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || uploading || !form.title || !form.eventDate} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving…" : "Save Event"}
              </Button>
              <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
