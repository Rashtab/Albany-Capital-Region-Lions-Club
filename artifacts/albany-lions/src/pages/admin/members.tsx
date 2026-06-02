import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import {
  Plus, Edit2, Trash2, Loader2, ArrowLeft, X,
  KeyRound, Mail, Phone, AlertCircle, CheckCircle2,
  Eye, EyeOff, Search, Users, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAdminMe, adminFetch, adminFetchForm,
  hasPermission, type AdminMember,
} from "@/lib/adminAuth";

// ── Constants ───────────────────────────────────────────────────

const VALID_ROLES = [
  "webmaster", "president", "secretary", "treasurer",
  "lcif_coordinator", "director", "member",
] as const;
type ValidRole = (typeof VALID_ROLES)[number];

const ROLE_LABELS: Record<string, string> = {
  webmaster: "Webmaster",
  president: "President",
  secretary: "Secretary",
  treasurer: "Treasurer",
  lcif_coordinator: "LCIF Coordinator",
  director: "Director",
  member: "Member",
};

const ROLE_COLORS: Record<string, string> = {
  webmaster: "bg-purple-100 text-purple-800",
  president: "bg-blue-100 text-blue-800",
  secretary: "bg-indigo-100 text-indigo-800",
  treasurer: "bg-emerald-100 text-emerald-800",
  lcif_coordinator: "bg-teal-100 text-teal-800",
  director: "bg-orange-100 text-orange-800",
  member: "bg-gray-100 text-gray-600",
};

const DUES_LABELS: Record<string, string> = { paid: "Paid", unpaid: "Unpaid", waived: "Waived" };
const DUES_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-red-100 text-red-700",
  waived: "bg-slate-100 text-slate-600",
};

const PERM_LABELS: Record<string, string> = {
  content: "Content", projects: "Projects", events: "Events",
  members: "Members", sponsors: "Sponsors", donations: "Donations",
  documents: "Documents", settings: "Settings", access_control: "Access Control",
  "*": "Full Access",
};

// ── Types ───────────────────────────────────────────────────────

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  joinDate: string | null;
  duesStatus: string;
  isVisible: boolean;
  bio: string | null;
  photoUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  role: ValidRole;
  status: string;
  duesStatus: string;
  joinDate: string;
  isVisible: boolean;
  bio: string;
  photoUrl: string;
  password: string;
}

const emptyForm: FormState = {
  name: "", email: "", phone: "", role: "member",
  status: "active", duesStatus: "unpaid",
  joinDate: "", isVisible: true, bio: "", photoUrl: "", password: "",
};

// ── Helpers ─────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-600"}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

// ── Component ───────────────────────────────────────────────────

export default function AdminMembers() {
  const [, navigate] = useLocation();
  const [me, setMe] = useState<AdminMember | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [permError, setPermError] = useState("");

  // List filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Panel state
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Photo upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Password reset (edit mode)
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Effective permissions (edit mode)
  const [effectivePerms, setEffectivePerms] = useState<string[]>([]);
  const [permsLoading, setPermsLoading] = useState(false);

  // Delete confirmation (edit mode)
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ── Auth ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminMe().then((m) => {
      if (!m) { navigate("/admin/login"); return; }
      setMe(m);
    });
  }, [navigate]);

  // ── Data ────────────────────────────────────────────────────────
  const fetchMembers = useCallback(() => {
    adminFetch<Member[]>("/api/members/all")
      .then(setMembers)
      .catch((err: Error) => {
        if (err.message.includes("403") || err.message.toLowerCase().includes("permission")) {
          setPermError("You don't have permission to manage members.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (me) fetchMembers(); }, [me, fetchMembers]);

  // ── Form helpers ────────────────────────────────────────────────
  const f =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const resetFormErrors = () => { setSaveError(""); setPwError(""); setDeleteError(""); };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingMember(null);
    resetFormErrors();
    setPwSuccess(false);
    setDeleteConfirm(false);
    setNewPassword("");
    setView("create");
  };

  const openEdit = async (m: Member) => {
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone ?? "",
      role: (VALID_ROLES as readonly string[]).includes(m.role) ? m.role as ValidRole : "member",
      status: m.status,
      duesStatus: m.duesStatus,
      joinDate: m.joinDate ? m.joinDate.slice(0, 10) : "",
      isVisible: m.isVisible,
      bio: m.bio ?? "",
      photoUrl: m.photoUrl ?? "",
      password: "",
    });
    setEditingMember(m);
    resetFormErrors();
    setPwSuccess(false);
    setDeleteConfirm(false);
    setNewPassword("");
    setView("edit");

    // Load effective permissions
    setPermsLoading(true);
    setEffectivePerms([]);
    try {
      const data = await adminFetch<{ permissions: string[] }>(`/api/members/${m.id}/permissions`);
      setEffectivePerms(data.permissions);
    } catch {
      setEffectivePerms([]);
    } finally {
      setPermsLoading(false);
    }
  };

  const backToList = () => {
    setView("list");
    setEditingMember(null);
    setDeleteConfirm(false);
  };

  // ── Photo upload ────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetchForm<{ url: string }>("/api/upload", fd);
      setForm((prev) => ({ ...prev, photoUrl: res.url }));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Save (create / update) ──────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError("Name is required."); return; }
    if (!form.email.trim()) { setSaveError("Email is required."); return; }
    if (view === "create" && form.password && form.password.length < 8) {
      setSaveError("Password must be at least 8 characters."); return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
        status: form.status,
        duesStatus: form.duesStatus,
        joinDate: form.joinDate || null,
        isVisible: form.isVisible,
        bio: form.bio.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
      };
      if (view === "create" && form.password.trim()) body.password = form.password;

      if (view === "edit" && editingMember) {
        await adminFetch(`/api/members/${editingMember.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await adminFetch("/api/members", { method: "POST", body: JSON.stringify(body) });
      }
      fetchMembers();
      backToList();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Password reset ──────────────────────────────────────────────
  const handlePasswordReset = async () => {
    if (!editingMember) return;
    if (!newPassword || newPassword.length < 8) {
      setPwError("Password must be at least 8 characters."); return;
    }
    setPwSaving(true);
    setPwError("");
    setPwSuccess(false);
    try {
      await adminFetch(`/api/members/${editingMember.id}/set-password`, {
        method: "POST",
        body: JSON.stringify({ newPassword }),
      });
      setPwSuccess(true);
      setNewPassword("");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setPwSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editingMember) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await adminFetch(`/api/members/${editingMember.id}`, { method: "DELETE" });
      fetchMembers();
      backToList();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  };

  // ── Filtered list ───────────────────────────────────────────────
  const filtered = members.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (ROLE_LABELS[m.role] ?? m.role).toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ── Loading / permission guard ──────────────────────────────────
  if (loading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (permError || !hasPermission(me, "members")) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4 p-8">
        <Users className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-destructive font-semibold text-center">
          {permError || "You don't have permission to manage members."}
        </p>
        <Link href="/admin">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // FORM VIEW (create or edit)
  // ═══════════════════════════════════════════════════════════════
  if (view === "create" || view === "edit") {
    const isEdit = view === "edit";
    return (
      <div className="min-h-screen bg-muted/30">

        {/* Top bar */}
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
          <button onClick={backToList} className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-black text-lg">
              {isEdit ? `Edit Member` : "New Member"}
            </h1>
            {isEdit && editingMember && (
              <span className="text-primary-foreground/60 text-sm truncate hidden sm:block">
                — {editingMember.name}
              </span>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-2xl py-8 space-y-6">

          {/* ── Profile section ──────────────────────────────── */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black text-muted-foreground uppercase tracking-wider">Profile</h2>

            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border">
                {form.photoUrl
                  ? <img src={form.photoUrl} alt="Photo" className="h-full w-full object-cover" />
                  : <span className="text-lg font-black text-primary/50">{form.name ? initials(form.name) : "?"}</span>}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-input rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.photoUrl} onChange={f("photoUrl")} placeholder="Photo URL (optional)"
                  />
                  <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()} className="shrink-0 text-xs">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                  </Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(file); e.target.value = ""; }}
                  />
                </div>
                {form.photoUrl && (
                  <button onClick={() => setForm((p) => ({ ...p, photoUrl: "" }))} className="text-xs text-muted-foreground hover:text-destructive">Remove photo</button>
                )}
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name <span className="text-destructive">*</span></label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.name} onChange={f("name")} placeholder="First Last"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Email <span className="text-destructive">*</span></label>
                <input
                  type="email"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.email} onChange={f("email")} placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Phone + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.phone} onChange={f("phone")} placeholder="555-000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Role</label>
                <select
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.role} onChange={f("role")}
                >
                  {VALID_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
            </div>

            {/* Status + Dues + Join Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Status</label>
                <select
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.status} onChange={f("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Dues</label>
                <select
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.duesStatus} onChange={f("duesStatus")}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="waived">Waived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Join Date</label>
                <input
                  type="date"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.joinDate} onChange={f("joinDate")}
                />
              </div>
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isVisible: !p.isVisible }))}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${form.isVisible ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isVisible ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <div>
                <p className="text-sm font-semibold leading-none">Show on public website</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {form.isVisible ? "This member appears in the public leadership/roster section." : "Hidden from the public website."}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold mb-1">Bio <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                rows={3}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={form.bio} onChange={f("bio")} placeholder="Short bio shown on the website…"
              />
            </div>
          </div>

          {/* ── Initial password (create only) ───────────────── */}
          {!isEdit && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div>
                <h2 className="text-xs font-black text-muted-foreground uppercase tracking-wider">Login Password</h2>
                <p className="text-xs text-muted-foreground mt-1">Optional. If left blank the account is created but cannot log in until a password is set.</p>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="w-full border border-input rounded-lg px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.password} onChange={f("password")} placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Effective permissions (edit only) ────────────── */}
          {isEdit && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-xs font-black text-muted-foreground uppercase tracking-wider">Effective Permissions</h2>
              </div>
              {permsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : effectivePerms.length === 0 ? (
                <p className="text-xs text-muted-foreground">No permissions — this member can log in but cannot access any admin sections.</p>
              ) : effectivePerms.includes("*") ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" /> Full Access (*)
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {effectivePerms.map((p) => (
                    <span key={p} className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {PERM_LABELS[p] ?? p}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground/70">
                Permissions are controlled by role + per-member overrides. Manage them in{" "}
                <Link href="/admin/access-control" className="underline hover:text-primary">Access Control</Link>.
              </p>
            </div>
          )}

          {/* ── Save error + actions ──────────────────────────── */}
          {saveError && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {saveError}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {isEdit ? "Save Changes" : "Create Member"}
            </Button>
            <Button variant="outline" onClick={backToList} disabled={saving}>
              <X className="h-4 w-4 mr-1.5" /> Cancel
            </Button>
          </div>

          {/* ── Password reset (edit only) ────────────────────── */}
          {isEdit && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-xs font-black text-muted-foreground uppercase tracking-wider">Reset Password</h2>
              </div>
              <p className="text-xs text-muted-foreground">Set a new password for this member's admin login. They won't be asked for their current password.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="w-full border border-input rounded-lg px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPwError(""); if (e.target.value) setPwSuccess(false); }}
                    placeholder="New password (min. 8 chars)"
                  />
                  <button type="button" onClick={() => setShowNewPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handlePasswordReset}
                  disabled={pwSaving || !newPassword}
                  className="shrink-0"
                >
                  {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Password"}
                </Button>
              </div>
              {pwError && (
                <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />{pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Password updated successfully.
                </div>
              )}
            </div>
          )}

          {/* ── Danger zone: delete (edit only) ──────────────── */}
          {isEdit && (
            <div className="bg-card border border-destructive/20 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-black text-destructive/70 uppercase tracking-wider">Danger Zone</h2>
              <p className="text-xs text-muted-foreground">Removing a member soft-deletes the record — it won't appear in any lists. This cannot be undone from the UI.</p>

              {!deleteConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Member
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-destructive">
                    Remove <span className="font-black">{editingMember?.name}</span>? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                      Yes, remove
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setDeleteConfirm(false); setDeleteError(""); }} disabled={deleting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {deleteError && (
                <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />{deleteError}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════
  const activeCount = members.filter((m) => m.status === "active").length;

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button>
          </Link>
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-secondary" />
            <div>
              <h1 className="font-black text-base leading-none">Members</h1>
              <p className="text-primary-foreground/50 text-xs mt-0.5">
                {members.length} total · {activeCount} active
              </p>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={openCreate} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
          <Plus className="h-4 w-4 mr-1.5" /> New Member
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-6 space-y-4">

        {/* Search + Role filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full border border-input rounded-xl pl-9 pr-4 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role…"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select
            className="border border-input rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            {VALID_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>

        {/* Member list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {members.length === 0 ? (
              <>
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold mb-1">No members yet</p>
                <p className="text-sm">Click "New Member" to add the first one.</p>
              </>
            ) : (
              <>
                <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No members match your search</p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {filtered.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer ${i !== 0 ? "border-t border-border" : ""}`}
                onClick={() => openEdit(m)}
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border text-primary/60 font-black text-sm">
                  {m.photoUrl
                    ? <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
                    : initials(m.name)}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-foreground truncate">{m.name}</span>
                    <RoleBadge role={m.role} />
                    {m.status === "inactive" && (
                      <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.email}</p>
                </div>

                {/* Dues badge */}
                <div className="hidden sm:block shrink-0">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${DUES_COLORS[m.duesStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    {DUES_LABELS[m.duesStatus] ?? m.duesStatus}
                  </span>
                </div>

                {/* Edit icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); openEdit(m); }}
                  className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shrink-0"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer count */}
        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filtered.length} of {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
