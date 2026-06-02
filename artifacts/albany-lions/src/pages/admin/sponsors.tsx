import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, X, Upload, Globe, Mail, Phone, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAdminMe, adminFetch, adminFetchForm, hasPermission, type AdminMember } from "@/lib/adminAuth";

// ── Types ──────────────────────────────────────────────────────

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logoUrl: string | null;
  website: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
}

const TIERS = ["platinum", "gold", "silver", "bronze", "community"] as const;
const TIER_LABELS: Record<string, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  community: "Community",
};
const TIER_COLORS: Record<string, string> = {
  platinum: "bg-slate-200 text-slate-800",
  gold: "bg-yellow-100 text-yellow-800",
  silver: "bg-gray-100 text-gray-700",
  bronze: "bg-orange-100 text-orange-800",
  community: "bg-blue-100 text-blue-700",
};

const emptyForm = {
  name: "",
  tier: "bronze",
  logoUrl: "",
  website: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  sortOrder: 0,
  status: "active",
};

type FormState = typeof emptyForm;

// ── Component ──────────────────────────────────────────────────

export default function AdminSponsors() {
  const [, navigate] = useLocation();
  const [me, setMe] = useState<AdminMember | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [permError, setPermError] = useState("");

  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminMe().then((m) => {
      if (!m) { navigate("/admin/login"); return; }
      setMe(m);
    });
  }, [navigate]);

  // ── Data ──────────────────────────────────────────────────────
  const fetchSponsors = useCallback(() => {
    adminFetch<Sponsor[]>("/api/sponsors/all")
      .then(setSponsors)
      .catch((err: Error) => {
        if (err.message.includes("403") || err.message.toLowerCase().includes("permission")) {
          setPermError("You don't have permission to manage sponsors.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (me) fetchSponsors(); }, [me, fetchSponsors]);

  // ── Form helpers ──────────────────────────────────────────────
  const f = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: field === "sortOrder" ? Number(e.target.value) : e.target.value }));

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setSaveError("");
    setCreating(true);
  };

  const openEdit = (s: Sponsor) => {
    setForm({
      name: s.name,
      tier: s.tier,
      logoUrl: s.logoUrl ?? "",
      website: s.website ?? "",
      contactName: s.contactName ?? "",
      contactEmail: s.contactEmail ?? "",
      contactPhone: s.contactPhone ?? "",
      sortOrder: s.sortOrder,
      status: s.status,
    });
    setEditing(s);
    setSaveError("");
    setCreating(true);
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetchForm<{ url: string }>("/api/upload", fd);
      setForm((prev) => ({ ...prev, logoUrl: res.url }));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError("Name is required."); return; }
    setSaving(true);
    setSaveError("");
    try {
      const body = {
        ...form,
        sortOrder: Number(form.sortOrder),
        logoUrl: form.logoUrl || null,
        website: form.website || null,
        contactName: form.contactName || null,
        contactEmail: form.contactEmail || null,
        contactPhone: form.contactPhone || null,
      };
      if (editing) {
        await adminFetch(`/api/sponsors/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await adminFetch("/api/sponsors", { method: "POST", body: JSON.stringify(body) });
      }
      setCreating(false);
      setEditing(null);
      fetchSponsors();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Sponsor) => {
    if (!confirm(`Delete sponsor "${s.name}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`/api/sponsors/${s.id}`, { method: "DELETE" });
      fetchSponsors();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // ── Grouped by tier ───────────────────────────────────────────
  const grouped = TIERS.reduce<Record<string, Sponsor[]>>((acc, tier) => {
    acc[tier] = sponsors.filter((s) => s.tier === tier);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  // ── Loading ───────────────────────────────────────────────────
  if (loading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── No permission ─────────────────────────────────────────────
  if (permError || !hasPermission(me, "sponsors")) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive font-semibold text-center">{permError || "You don't have permission to manage sponsors."}</p>
        <Link href="/admin"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button></Link>
      </div>
    );
  }

  // ── Form panel ────────────────────────────────────────────────
  if (creating) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
          <button onClick={() => { setCreating(false); setEditing(null); }} className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-black text-lg">{editing ? "Edit Sponsor" : "New Sponsor"}</h1>
        </div>

        <div className="container mx-auto px-4 max-w-2xl py-8 space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Name <span className="text-destructive">*</span></label>
            <input
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.name} onChange={f("name")} placeholder="Sponsor name"
            />
          </div>

          {/* Tier + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Tier</label>
              <select
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.tier} onChange={f("tier")}
              >
                {TIERS.map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Status</label>
              <select
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.status} onChange={f("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-bold mb-1">Logo</label>
            {form.logoUrl && (
              <div className="mb-2 flex items-center gap-3">
                <img src={form.logoUrl} alt="Logo preview" className="h-14 w-14 object-contain rounded border border-border bg-white p-1" />
                <button onClick={() => setForm((p) => ({ ...p, logoUrl: "" }))} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                className="flex-1 border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.logoUrl} onChange={f("logoUrl")} placeholder="https://… or upload →"
              />
              <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()} className="shrink-0">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = ""; }}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-bold mb-1 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</label>
            <input
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.website} onChange={f("website")} placeholder="https://…"
            />
          </div>

          {/* Contact fields */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contact (optional)</p>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1"><User className="h-3 w-3" /> Name</label>
              <input
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.contactName} onChange={f("contactName")} placeholder="Contact person"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.contactEmail} onChange={f("contactEmail")} placeholder="email@…"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.contactPhone} onChange={f("contactPhone")} placeholder="555-…"
                />
              </div>
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-sm font-bold mb-1 flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Sort Order</label>
            <input
              type="number" min={0}
              className="w-32 border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.sortOrder} onChange={f("sortOrder")}
            />
            <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first within their tier.</p>
          </div>

          {/* Error */}
          {saveError && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{saveError}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {editing ? "Save Changes" : "Create Sponsor"}
            </Button>
            <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>
              <X className="h-4 w-4 mr-1.5" /> Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin"><button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button></Link>
          <h1 className="font-black text-lg">Sponsors</h1>
        </div>
        <Button size="sm" onClick={openCreate} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
          <Plus className="h-4 w-4 mr-1.5" /> New Sponsor
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold mb-2">No sponsors yet</p>
            <p className="text-sm mb-4">Click "New Sponsor" to add the first one.</p>
          </div>
        ) : (
          TIERS.filter((t) => grouped[t].length > 0).map((tier) => (
            <div key={tier}>
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${TIER_COLORS[tier]}`}>{TIER_LABELS[tier]}</span>
                <span>{grouped[tier].length} sponsor{grouped[tier].length !== 1 ? "s" : ""}</span>
              </h2>
              <div className="space-y-2">
                {grouped[tier].map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
                    {/* Logo */}
                    <div className="h-12 w-12 rounded-lg border border-border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      {s.logoUrl
                        ? <img src={s.logoUrl} alt={s.name} className="h-full w-full object-contain p-1" />
                        : <span className="text-lg font-black text-muted-foreground/40">{s.name.charAt(0)}</span>}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-foreground">{s.name}</p>
                        {s.status === "inactive" && (
                          <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">inactive</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-0.5">
                        {s.website && (
                          <a href={s.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 truncate max-w-[180px]">
                            <Globe className="h-3 w-3 shrink-0" />{s.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                        {s.contactName && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />{s.contactName}
                          </span>
                        )}
                        {s.contactEmail && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />{s.contactEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
