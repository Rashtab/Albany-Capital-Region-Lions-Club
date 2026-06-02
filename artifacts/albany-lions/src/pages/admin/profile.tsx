import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AdminMember, fetchAdminMe, adminFetch, ROLE_LABELS, ROLE_COLORS } from "@/lib/adminAuth";

export default function AdminProfile() {
  const [, navigate] = useLocation();
  const [member, setMember] = useState<AdminMember | null>(null);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchAdminMe().then((m) => {
      if (!m) navigate("/admin/login");
      else setMember(m);
    });
  }, [navigate]);

  const handleSavePassword = async () => {
    if (!member) return;
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ ok: false, text: "New passwords do not match" }); return; }
    if (pwForm.newPassword.length < 8) { setPwMsg({ ok: false, text: "New password must be at least 8 characters" }); return; }
    setSavingPw(true); setPwMsg(null);
    try {
      await adminFetch("/api/admin/set-password", {
        method: "POST",
        body: JSON.stringify({ email: member.email, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      setPwMsg({ ok: true, text: "Password updated successfully!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Update failed" });
    } finally { setSavingPw(false); }
  };

  const inputCls = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30";

  if (!member) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
    </div>
  );

  const roleLabel = ROLE_LABELS[member.role] ?? member.role;
  const roleColor = ROLE_COLORS[member.role] ?? "bg-primary text-primary-foreground";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin">
          <button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button>
        </Link>
        <h1 className="font-black text-lg">My Profile</h1>
      </div>

      <div className="container mx-auto px-4 max-w-2xl py-10 space-y-6">

        {/* Account banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-black text-primary text-lg">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${roleColor}`}>{roleLabel}</span>
          </div>
        </motion.div>

        {/* Permissions summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
          className="bg-card border border-border rounded-xl px-6 py-5">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">Your Permissions</p>
          <div className="flex flex-wrap gap-2">
            {member.permissions.map((p) => (
              <span key={p} className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">{p === "*" ? "Full access (wildcard)" : p}</span>
            ))}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
          className="bg-card border border-card-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="font-black text-foreground">Change Password</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={pwForm.currentPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, currentPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={pwForm.newPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, newPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={pwForm.confirmPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, confirmPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Repeat new password" />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {pwMsg && <p className={`text-sm font-medium ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>{pwMsg.text}</p>}

          <Button onClick={handleSavePassword}
            disabled={savingPw || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword || pwForm.newPassword !== pwForm.confirmPassword}
            className="gap-2">
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {savingPw ? "Updating…" : "Update Password"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
