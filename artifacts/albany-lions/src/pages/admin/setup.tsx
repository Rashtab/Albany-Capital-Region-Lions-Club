import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

// The /admin/setup route is retired — initial setup is now done via
// the members table and POST /api/admin/set-password.
// Redirect anyone who lands here to the login page.
export default function AdminSetup() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/admin/login"); }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
      <Loader2 className="h-7 w-7 animate-spin text-white/60" />
    </div>
  );
}
