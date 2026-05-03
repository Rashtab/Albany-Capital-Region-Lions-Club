import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, User, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin, getUser, getToken, saveAuth, authHeaders } from "@/lib/auth";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminProfile() {
  const [, navigate] = useLocation();
  const user = getUser();

  const [nameForm, setNameForm] = useState({ name: user?.name ?? "" });
  const [emailForm, setEmailForm] = useState({ email: user?.email ?? "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => { if (!isAdmin()) navigate("/admin/login"); }, [navigate]);

  const applyUpdate = async (
    payload: Record<string, string>,
    setSaving: (v: boolean) => void,
    setMsg: (m: { ok: boolean; text: string } | null) => void,
  ) => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${BASE}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { token?: string; user?: { id: number; name: string; email: string; role: string }; error?: string };
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Update failed" });
        return;
      }
      saveAuth(data.token!, data.user!);
      setMsg({ ok: true, text: "Saved successfully!" });
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveName = () => {
    if (!nameForm.name.trim()) return;
    applyUpdate({ name: nameForm.name }, setSavingName, setNameMsg);
  };

  const handleSaveEmail = () => {
    if (!emailForm.email.trim()) return;
    applyUpdate({ email: emailForm.email }, setSavingEmail, setEmailMsg);
  };

  const handleSavePassword = () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ ok: false, text: "New passwords do not match" });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ ok: false, text: "New password must be at least 8 characters" });
      return;
    }
    applyUpdate(
      { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
      setSavingPw,
      (msg) => {
        setPwMsg(msg);
        if (msg?.ok) setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      },
    );
  };

  const inputCls = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <Link href="/admin">
          <button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button>
        </Link>
        <h1 className="font-black text-lg">My Profile</h1>
      </div>

      <div className="container mx-auto px-4 max-w-2xl py-10 space-y-6">

        {/* Account info banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-black text-primary">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full font-semibold capitalize">{user?.role}</span>
          </div>
        </motion.div>

        {/* Display Name */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-card border border-card-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-black text-foreground">Display Name</h2>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Name</label>
            <input value={nameForm.name} onChange={(e) => { setNameForm({ name: e.target.value }); setNameMsg(null); }}
              className={inputCls} placeholder="Your display name" />
          </div>
          {nameMsg && (
            <p className={`text-sm font-medium ${nameMsg.ok ? "text-green-600" : "text-red-500"}`}>{nameMsg.text}</p>
          )}
          <Button onClick={handleSaveName} disabled={savingName || !nameForm.name.trim()} className="gap-2">
            {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {savingName ? "Saving…" : "Save Name"}
          </Button>
        </motion.div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
          className="bg-card border border-card-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="font-black text-foreground">Email Address</h2>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Email</label>
            <input type="email" value={emailForm.email} onChange={(e) => { setEmailForm({ email: e.target.value }); setEmailMsg(null); }}
              className={inputCls} placeholder="admin@example.com" />
          </div>
          {emailMsg && (
            <p className={`text-sm font-medium ${emailMsg.ok ? "text-green-600" : "text-red-500"}`}>{emailMsg.text}</p>
          )}
          <Button onClick={handleSaveEmail} disabled={savingEmail || !emailForm.email.trim()} className="gap-2">
            {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {savingEmail ? "Saving…" : "Save Email"}
          </Button>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card border border-card-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="font-black text-foreground">Change Password</h2>
          </div>

          {/* Current password */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"}
                value={pwForm.currentPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, currentPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, newPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"}
                value={pwForm.confirmPassword}
                onChange={(e) => { setPwForm((f) => ({ ...f, confirmPassword: e.target.value })); setPwMsg(null); }}
                className={`${inputCls} pr-10`} placeholder="Repeat new password" />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {pwMsg && (
            <p className={`text-sm font-medium ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>{pwMsg.text}</p>
          )}

          <Button
            onClick={handleSavePassword}
            disabled={savingPw || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword || pwForm.newPassword !== pwForm.confirmPassword}
            className="gap-2"
          >
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {savingPw ? "Updating…" : "Update Password"}
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
