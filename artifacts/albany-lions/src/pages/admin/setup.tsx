import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { UserPlus, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAuth, apiFetch } from "@/lib/auth";

export default function AdminSetup() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string; user: { id: number; name: string; email: string; role: string } }>(
        "/api/auth/setup",
        { method: "POST", body: JSON.stringify({ name, email, password }) }
      );
      saveAuth(res.token, res.user);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary px-8 py-8 text-center">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-secondary" />
            </div>
            <h1 className="text-2xl font-black text-primary-foreground">Create Admin Account</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">First-time setup only</p>
          </div>
          <form onSubmit={handleSetup} className="px-8 py-8 space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="admin@albanylionsclub.org" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Min 8 characters" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2 font-bold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "Creating…" : "Create Admin Account"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
