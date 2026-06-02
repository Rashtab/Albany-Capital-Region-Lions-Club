import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShieldCheck, ArrowLeft, Loader2, Save, AlertCircle,
  CheckCircle2, Trash2, Plus, LogOut, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAdminMe, adminFetch, adminLogout,
  hasPermission, isFullAccessMember, ROLE_LABELS,
  type AdminMember,
} from "@/lib/adminAuth";

// ── Constants ──────────────────────────────────────────────────

const ALL_PERMS = [
  "content", "projects", "events", "members",
  "sponsors", "donations", "documents", "settings", "access_control",
] as const;
type Perm = (typeof ALL_PERMS)[number];

const PERM_LABELS: Record<string, string> = {
  content: "Content",
  projects: "Projects",
  events: "Events",
  members: "Members",
  sponsors: "Sponsors",
  donations: "Donations",
  documents: "Documents",
  settings: "Settings",
  access_control: "Access Ctrl",
};

const ALL_ROLES = [
  "webmaster", "president", "secretary",
  "treasurer", "lcif_coordinator", "director", "member",
];

// ── Types ──────────────────────────────────────────────────────

interface MemberOverride { memberId: number; permission: string; granted: boolean; }
interface MemberRow { id: number; name: string; email: string; role: string; }

// ── Helpers ────────────────────────────────────────────────────

function effectivePerms(
  memberRole: string,
  rolePerms: Record<string, string[]>,
  overrides: MemberOverride[],
  memberId: number,
): string[] {
  const rp = rolePerms[memberRole] ?? [];
  const base = new Set<string>(rp.includes("*") ? [...ALL_PERMS] : rp);
  for (const ov of overrides.filter((o) => o.memberId === memberId)) {
    if (ov.granted) base.add(ov.permission);
    else base.delete(ov.permission);
  }
  return [...base].sort();
}

// ── Main component ─────────────────────────────────────────────

export default function AdminAccessControl() {
  const [, navigate] = useLocation();
  const [me, setMe] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Role permissions state
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [roleSaving, setRoleSaving] = useState<Record<string, boolean>>({});
  const [roleErrors, setRoleErrors] = useState<Record<string, string>>({});
  const [roleSaved, setRoleSaved] = useState<Record<string, boolean>>({});

  // Member overrides state
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [allOverrides, setAllOverrides] = useState<MemberOverride[]>([]);
  const [ovError, setOvError] = useState("");
  const [ovSaving, setOvSaving] = useState(false);
  const [addPerm, setAddPerm] = useState<string>(ALL_PERMS[0]);
  const [addGranted, setAddGranted] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminMe().then((m) => {
      if (!m) { navigate("/admin/login"); return; }
      if (!hasPermission(m, "access_control")) { navigate("/admin"); return; }
      setMe(m);
    }).finally(() => setLoading(false));
  }, [navigate]);

  // ── Load role perms + overrides + members ─────────────────────
  const loadRolePerms = useCallback(() => {
    adminFetch<Record<string, string[]>>("/api/admin/role-permissions")
      .then((data) => {
        // Ensure all roles have an entry
        const normalised: Record<string, string[]> = {};
        for (const role of ALL_ROLES) normalised[role] = data[role] ?? [];
        setRolePerms(normalised);
        setDrafts(structuredClone(normalised));
      })
      .catch(() => {});
  }, []);

  const loadOverrides = useCallback(() => {
    adminFetch<MemberOverride[]>("/api/admin/member-permissions")
      .then(setAllOverrides)
      .catch(() => {});
  }, []);

  const loadMembers = useCallback(() => {
    adminFetch<MemberRow[]>("/api/admin/members")
      .then(setMembers)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!me) return;
    loadRolePerms();
    loadOverrides();
    loadMembers();
  }, [me, loadRolePerms, loadOverrides, loadMembers]);

  // ── Role perm helpers ─────────────────────────────────────────

  function isDirty(role: string) {
    const saved = (rolePerms[role] ?? []).slice().sort().join(",");
    const draft = (drafts[role] ?? []).slice().sort().join(",");
    return saved !== draft;
  }

  function togglePerm(role: string, perm: string) {
    setDrafts((prev) => {
      const current = prev[role] ?? [];
      const next = current.includes(perm)
        ? current.filter((p) => p !== perm)
        : [...current, perm];
      // If toggling * off, keep individual perms intact
      return { ...prev, [role]: next };
    });
    setRoleErrors((e) => ({ ...e, [role]: "" }));
  }

  function toggleWildcard(role: string) {
    setDrafts((prev) => {
      const current = prev[role] ?? [];
      const next = current.includes("*")
        ? current.filter((p) => p !== "*")
        : ["*"];
      return { ...prev, [role]: next };
    });
    setRoleErrors((e) => ({ ...e, [role]: "" }));
  }

  async function saveRole(role: string) {
    setRoleSaving((s) => ({ ...s, [role]: true }));
    setRoleErrors((e) => ({ ...e, [role]: "" }));
    setRoleSaved((s) => ({ ...s, [role]: false }));
    try {
      await adminFetch(`/api/admin/role-permissions/${role}`, {
        method: "PUT",
        body: JSON.stringify({ permissions: drafts[role] ?? [] }),
      });
      setRolePerms((p) => ({ ...p, [role]: drafts[role] ?? [] }));
      setRoleSaved((s) => ({ ...s, [role]: true }));
      setTimeout(() => setRoleSaved((s) => ({ ...s, [role]: false })), 2500);
    } catch (err) {
      setRoleErrors((e) => ({ ...e, [role]: err instanceof Error ? err.message : "Save failed" }));
    } finally {
      setRoleSaving((s) => ({ ...s, [role]: false }));
    }
  }

  function revertRole(role: string) {
    setDrafts((prev) => ({ ...prev, [role]: [...(rolePerms[role] ?? [])] }));
    setRoleErrors((e) => ({ ...e, [role]: "" }));
  }

  // ── Override helpers ──────────────────────────────────────────

  const selectedMember = members.find((m) => m.id === selectedId) ?? null;
  const memberOverrides = allOverrides.filter((o) => o.memberId === selectedId);

  async function saveOverride() {
    if (!selectedId) return;
    setOvSaving(true);
    setOvError("");
    try {
      await adminFetch(`/api/admin/member-permissions/${selectedId}/${addPerm}`, {
        method: "PUT",
        body: JSON.stringify({ granted: addGranted }),
      });
      loadOverrides();
    } catch (err) {
      setOvError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setOvSaving(false);
    }
  }

  async function removeOverride(memberId: number, permission: string) {
    setOvError("");
    try {
      await adminFetch(`/api/admin/member-permissions/${memberId}/${permission}`, {
        method: "DELETE",
      });
      loadOverrides();
    } catch (err) {
      setOvError(err instanceof Error ? err.message : "Remove failed");
    }
  }

  // ── Filtered members for search ───────────────────────────────

  const filteredMembers = memberSearch.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(memberSearch.toLowerCase()),
      )
    : members;

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await adminLogout(); } finally { navigate("/admin/login"); }
  };

  // ── Loading / guard states ────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!me) return null;

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-5 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
          <div>
            <p className="font-black text-sm leading-none">Access Control</p>
            <p className="text-primary-foreground/50 text-xs mt-0.5">Albany Capital Region Lions Club</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <button className="flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors px-2 py-1 rounded hover:bg-white/10">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors px-2 py-1 rounded hover:bg-white/10 disabled:opacity-50"
          >
            {loggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            Sign out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8 space-y-8">

        {/* ── Section 1: Role Permissions ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-base font-black text-foreground uppercase tracking-wider mb-1">
            Role Permissions
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Each checkbox grants that permission to every member in the role. Changes are staged locally — hit <strong>Save</strong> to apply.
          </p>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header row */}
            <div className="hidden md:grid bg-muted/60 border-b border-border px-5 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wide"
              style={{ gridTemplateColumns: "160px 36px repeat(9, 1fr) 100px" }}
            >
              <span>Role</span>
              <span className="text-center" title="Wildcard — grants all current and future permissions">*</span>
              {ALL_PERMS.map((p) => (
                <span key={p} className="text-center truncate" title={PERM_LABELS[p]}>{PERM_LABELS[p]}</span>
              ))}
              <span />
            </div>

            {ALL_ROLES.map((role, i) => {
              const draft = drafts[role] ?? [];
              const hasWild = draft.includes("*");
              const dirty = isDirty(role);
              const saving = roleSaving[role] ?? false;
              const error = roleErrors[role] ?? "";
              const saved = roleSaved[role] ?? false;

              return (
                <div key={role} className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                  {/* Desktop row */}
                  <div
                    className="hidden md:grid items-center px-5 py-3 gap-x-1"
                    style={{ gridTemplateColumns: "160px 36px repeat(9, 1fr) 100px" }}
                  >
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        {ROLE_LABELS[role] ?? role}
                      </span>
                    </div>

                    {/* Wildcard checkbox */}
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={hasWild}
                        onChange={() => toggleWildcard(role)}
                        className="h-4 w-4 cursor-pointer accent-secondary"
                        title="Full access (*)"
                      />
                    </div>

                    {/* Individual perm checkboxes */}
                    {ALL_PERMS.map((perm) => (
                      <div key={perm} className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={hasWild || draft.includes(perm)}
                          disabled={hasWild}
                          onChange={() => togglePerm(role, perm)}
                          className="h-4 w-4 cursor-pointer accent-primary disabled:opacity-40 disabled:cursor-not-allowed"
                          title={PERM_LABELS[perm]}
                        />
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      {saved && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                      {dirty && !saving && (
                        <button
                          onClick={() => revertRole(role)}
                          className="text-xs text-muted-foreground hover:text-foreground px-1"
                          title="Revert"
                        >✕</button>
                      )}
                      <Button
                        size="sm"
                        variant={dirty ? "default" : "outline"}
                        disabled={!dirty || saving}
                        onClick={() => saveRole(role)}
                        className={`h-7 text-xs px-3 ${dirty ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-foreground">{ROLE_LABELS[role] ?? role}</span>
                      <div className="flex items-center gap-2">
                        {saved && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {dirty && !saving && (
                          <button onClick={() => revertRole(role)} className="text-xs text-muted-foreground">✕</button>
                        )}
                        <Button
                          size="sm"
                          variant={dirty ? "default" : "outline"}
                          disabled={!dirty || saving}
                          onClick={() => saveRole(role)}
                          className="h-7 text-xs px-3"
                        >
                          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground col-span-2">
                        <input
                          type="checkbox"
                          checked={hasWild}
                          onChange={() => toggleWildcard(role)}
                          className="h-4 w-4 accent-secondary"
                        />
                        <span className="font-bold text-foreground">Wildcard (*) — full access</span>
                      </label>
                      {ALL_PERMS.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={hasWild || draft.includes(perm)}
                            disabled={hasWild}
                            onChange={() => togglePerm(role, perm)}
                            className="h-4 w-4 accent-primary disabled:opacity-40"
                          />
                          {PERM_LABELS[perm]}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Inline error */}
                  {error && (
                    <div className="mx-5 mb-3 flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            The <strong>*</strong> (wildcard) column grants every present and future permission. Use it for roles that should always have full access regardless of what's added later.
          </p>
        </motion.div>

        {/* ── Section 2: Per-Member Overrides ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <h2 className="text-base font-black text-foreground uppercase tracking-wider mb-1">
            Per-Member Overrides
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Grant or revoke individual permissions for a specific member, overriding their role defaults.
          </p>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">

            {/* Member search */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Search Member
              </label>
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => { setMemberSearch(e.target.value); setSelectedId(null); }}
                placeholder="Type name or email…"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
              />
              {memberSearch.trim() && (
                <div className="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  {filteredMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-3 py-2">No members found.</p>
                  ) : (
                    filteredMembers.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedId(m.id); setMemberSearch(""); setOvError(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted/60 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.email} · {ROLE_LABELS[m.role] ?? m.role}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
              {members.length === 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  Member list requires the <strong>members</strong> permission to load.
                </p>
              )}
            </div>

            {/* Selected member panel */}
            {selectedMember && (
              <div className="space-y-4 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{selectedMember.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.email} · {ROLE_LABELS[selectedMember.role] ?? selectedMember.role}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedId(null); setOvError(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕ Clear
                  </button>
                </div>

                {/* Effective permissions */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Effective Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {effectivePerms(selectedMember.role, rolePerms, allOverrides, selectedMember.id).map((p) => (
                      <span key={p} className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {PERM_LABELS[p] ?? p}
                      </span>
                    ))}
                    {effectivePerms(selectedMember.role, rolePerms, allOverrides, selectedMember.id).length === 0 && (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </div>

                {/* Current overrides */}
                {memberOverrides.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Active Overrides</p>
                    <div className="space-y-1.5">
                      {memberOverrides.map((ov) => (
                        <div key={ov.permission} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ov.granted ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {ov.granted ? "Grant" : "Revoke"}
                            </span>
                            <span className="text-sm text-foreground">{PERM_LABELS[ov.permission] ?? ov.permission}</span>
                          </div>
                          <button
                            onClick={() => removeOverride(ov.memberId, ov.permission)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                            title="Remove override"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add override */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Add Override</p>
                  <div className="flex flex-wrap items-end gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Permission</label>
                      <select
                        value={addPerm}
                        onChange={(e) => setAddPerm(e.target.value)}
                        className="border border-input rounded-lg px-2.5 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {ALL_PERMS.map((p) => (
                          <option key={p} value={p}>{PERM_LABELS[p]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Effect</label>
                      <select
                        value={addGranted ? "grant" : "revoke"}
                        onChange={(e) => setAddGranted(e.target.value === "grant")}
                        className="border border-input rounded-lg px-2.5 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="grant">Grant</option>
                        <option value="revoke">Revoke</option>
                      </select>
                    </div>
                    <Button
                      size="sm"
                      disabled={ovSaving}
                      onClick={saveOverride}
                      className="bg-primary text-primary-foreground h-[34px]"
                    >
                      {ovSaving
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><Plus className="h-3.5 w-3.5 mr-1" />Apply</>}
                    </Button>
                  </div>
                </div>

                {/* Override error */}
                {ovError && (
                  <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {ovError}
                  </div>
                )}
              </div>
            )}

            {/* Placeholder when no member selected */}
            {!selectedMember && memberSearch.trim() === "" && (
              <p className="text-sm text-muted-foreground text-center py-4 border-t border-border">
                Search for a member above to view or edit their permission overrides.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
