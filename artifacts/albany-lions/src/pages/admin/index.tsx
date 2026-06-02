import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield, ShieldCheck, LogOut, ExternalLink, Loader2,
  Users, Calendar, PenLine, Images, BookOpen,
  DollarSign, Handshake, CheckCircle2, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminMember,
  adminLogout,
  fetchAdminMe,
  ROLE_LABELS,
  ROLE_COLORS,
  PERMISSION_LABELS,
  hasPermission,
  isFullAccessMember,
} from "@/lib/adminAuth";

// ── Permission → section tile mapping ──────────────────────────

interface SectionTile {
  permission: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const SECTION_TILES: SectionTile[] = [
  {
    permission: "members",
    icon: Users,
    title: "Members",
    description: "Manage the member roster, roles, and contact information.",
    color: "bg-blue-600",
  },
  {
    permission: "events",
    icon: Calendar,
    title: "Events & Calendar",
    description: "Create and manage events shown on the public calendar.",
    color: "bg-green-600",
  },
  {
    permission: "content",
    icon: PenLine,
    title: "Blog & News",
    description: "Write, edit, and publish blog posts and announcements.",
    color: "bg-primary",
  },
  {
    permission: "content",
    icon: Images,
    title: "Gallery",
    description: "Upload and organise event photos for the public gallery.",
    color: "bg-purple-600",
  },
  {
    permission: "content",
    icon: BookOpen,
    title: "Magazines",
    description: "Upload magazine PDFs and manage publication listings.",
    color: "bg-yellow-600",
  },
  {
    permission: "donations",
    icon: DollarSign,
    title: "Donations",
    description: "Review donation records and fundraising activity.",
    color: "bg-emerald-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [member, setMember] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchAdminMe()
      .then((m) => {
        if (!m) navigate("/admin/login");
        else setMember(m);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await adminLogout();
    } finally {
      navigate("/admin/login");
    }
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!member) return null;

  const roleLabel = ROLE_LABELS[member.role] ?? member.role;
  const roleColor = ROLE_COLORS[member.role] ?? "bg-primary text-primary-foreground";
  const isFullAccess = isFullAccessMember(member);
  const visibleTiles = isFullAccess
    ? SECTION_TILES
    : SECTION_TILES.filter((t) => hasPermission(member, t.permission));

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-5 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-secondary shrink-0" />
          <div>
            <p className="font-black text-sm leading-none">Admin Portal</p>
            <p className="text-primary-foreground/50 text-xs mt-0.5">Albany Capital Region Lions Club</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <button className="hidden sm:flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors px-2 py-1 rounded hover:bg-white/10">
              <ExternalLink className="h-3.5 w-3.5" /> Website
            </button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors px-2 py-1 rounded hover:bg-white/10 disabled:opacity-50"
          >
            {loggingOut
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <LogOut className="h-3.5 w-3.5" />}
            Sign out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-10">

        {/* Welcome card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-card border border-border rounded-2xl p-7 mb-8 flex flex-col sm:flex-row sm:items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h1 className="text-xl font-black text-foreground">Welcome back, {member.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </motion.div>

        {/* Permissions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="bg-card border border-border rounded-2xl p-6 mb-8"
        >
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider mb-4">
            Your Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {isFullAccess ? (
              <div className="col-span-2 flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-foreground font-semibold">Full access</span>
                <span className="text-muted-foreground">— {PERMISSION_LABELS["all"]}</span>
              </div>
            ) : (
              member.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-foreground/90">{PERMISSION_LABELS[perm] ?? perm}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Management sections */}
        <div className="mb-4">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider mb-4">
            Management Sections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Members tile — live */}
            {hasPermission(member, "members") && (
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link href="/admin/members" className="block">
                  <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="bg-blue-600 text-white rounded-xl p-2.5 shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">Members</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Manage the member roster, roles, and contact information.
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {visibleTiles.filter((t) => t.permission !== "members").map((tile, i) => (
              <motion.div
                key={tile.title}
                custom={i + 1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 opacity-60 cursor-not-allowed select-none"
                title="Coming soon"
              >
                <div className={`${tile.color} text-white rounded-xl p-2.5 shrink-0`}>
                  <tile.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-foreground">{tile.title}</p>
                    <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> coming soon
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Sponsors tile — live */}
            {hasPermission(member, "sponsors") && (
              <motion.div
                custom={visibleTiles.length}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link href="/admin/sponsors" className="block">
                  <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="bg-orange-600 text-white rounded-xl p-2.5 shrink-0">
                      <Handshake className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">Sponsors</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Manage sponsor listings, tiers, and contact details.
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Access Control tile — visible only to access_control holders */}
            {hasPermission(member, "access_control") && (
              <motion.div
                custom={visibleTiles.length}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link href="/admin/access-control" className="block">
                  <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="bg-rose-700 text-white rounded-xl p-2.5 shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">Access Control</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Manage role permissions and per-member overrides.
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Management screens are being built. Authentication is confirmed working — you're logged in as{" "}
          <span className="font-semibold text-foreground">{roleLabel}</span>.
        </motion.p>

        <div className="flex justify-center mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
