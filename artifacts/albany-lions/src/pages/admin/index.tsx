import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { PenLine, Calendar, BookOpen, Images, LogOut, Shield, ChevronRight, Upload } from "lucide-react";
import { getUser, clearAuth, isAdmin } from "@/lib/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const sections = [
  { href: "/admin/blog", icon: PenLine, title: "Blog Posts", desc: "Create, edit, and publish blog posts and news articles.", color: "bg-blue-500" },
  { href: "/admin/events", icon: Calendar, title: "Events Calendar", desc: "Add and manage events shown on the calendar.", color: "bg-green-500" },
  { href: "/admin/magazine", icon: BookOpen, title: "Magazines", desc: "Upload magazine PDFs and manage publication listings.", color: "bg-secondary" },
  { href: "/admin/gallery", icon: Images, title: "Gallery", desc: "Upload and manage event photos for the gallery.", color: "bg-purple-500" },
  { href: "/admin/upload", icon: Upload, title: "File Upload", desc: "Upload images and PDFs for use across the site.", color: "bg-orange-500" },
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAdmin()) navigate("/admin/login");
  }, [navigate]);

  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-secondary" />
          <div>
            <p className="font-black text-sm">Admin Dashboard</p>
            <p className="text-primary-foreground/60 text-xs">Albany Capital Region Lions Club</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/80 hidden sm:block">Welcome, {user?.name}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-10">
          <h1 className="text-3xl font-black text-primary">Content Management</h1>
          <p className="text-muted-foreground mt-1">Manage all content on the Albany Capital Region Lions Club website.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s, i) => (
            <motion.div key={s.href} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <Link href={s.href}>
                <div className="bg-card border border-card-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex items-start gap-4">
                  <div className={`${s.color} text-white rounded-xl p-3 shrink-0 group-hover:scale-110 transition-transform`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-foreground group-hover:text-primary transition-colors">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-8 bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Public site:</span>{" "}
            <Link href="/" className="text-primary hover:underline">View website →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
