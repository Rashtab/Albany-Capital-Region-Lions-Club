import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import {
  ArrowLeft, Loader2, Save, CheckCircle2, AlertCircle,
  Globe, Phone, Mail, MapPin, Calendar, Heart, Home, Share2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAdminMe, adminFetch, hasPermission, type AdminMember } from "@/lib/adminAuth";

// ── Field + group definitions ────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: "input" | "textarea";
  rows?: number;
  inputType?: string;
  hint?: string;
  narrow?: boolean;
};

type GroupDef = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  fields: FieldDef[];
};

const GROUPS: GroupDef[] = [
  {
    id: "homepage",
    label: "Homepage",
    description: "Text displayed on the public homepage hero banner.",
    icon: Home,
    fields: [
      {
        key: "hero_headline",
        label: "Hero Headline",
        type: "input",
        hint: "Main headline on the hero banner (e.g. 'We Serve • We Lead • We Impact').",
      },
      {
        key: "hero_subtext",
        label: "Hero Subtext",
        type: "textarea",
        rows: 3,
        hint: "Supporting text shown below the headline.",
      },
    ],
  },
  {
    id: "about",
    label: "About & Mission",
    description: "Shown on the About page and in club-wide descriptions.",
    icon: Heart,
    fields: [
      {
        key: "mission_statement",
        label: "Mission Statement",
        type: "textarea",
        rows: 4,
      },
      {
        key: "club_description",
        label: "Club Description",
        type: "textarea",
        rows: 6,
        hint: "Full paragraph describing the club's background and focus.",
      },
      {
        key: "club_vision",
        label: "Club Vision",
        type: "textarea",
        rows: 2,
      },
      {
        key: "club_founded",
        label: "Year Founded",
        type: "input",
        narrow: true,
      },
      {
        key: "district",
        label: "Lions District",
        type: "input",
        hint: "e.g. '20-R2' or 'District 20-R2, New York'",
      },
      {
        key: "member_count",
        label: "Member Count",
        type: "input",
        narrow: true,
        hint: "Displayed as-is — use '24' or '25+' etc.",
      },
    ],
  },
  {
    id: "meetings",
    label: "Meetings",
    description: "Shown wherever meeting details appear on the site.",
    icon: Calendar,
    fields: [
      {
        key: "meeting_location",
        label: "Meeting Location",
        type: "input",
        hint: "Full address.",
      },
      {
        key: "meeting_schedule",
        label: "Meeting Schedule",
        type: "input",
        hint: "e.g. 'Third Tuesday of every month at 6:30 PM'",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    description: "Used in the footer, Contact page, and email links.",
    icon: Mail,
    fields: [
      {
        key: "contact_email",
        label: "Contact Email",
        type: "input",
        inputType: "email",
      },
      {
        key: "contact_phone",
        label: "Contact Phone",
        type: "input",
        inputType: "tel",
      },
    ],
  },
  {
    id: "social",
    label: "Social & Links",
    description: "Social media URLs and call-to-action link destinations.",
    icon: Share2,
    fields: [
      {
        key: "facebook_url",
        label: "Facebook URL",
        type: "input",
        inputType: "url",
      },
      {
        key: "instagram_url",
        label: "Instagram URL",
        type: "input",
        inputType: "url",
      },
      {
        key: "donate_url",
        label: "Donate Page URL",
        type: "input",
        hint: "Relative (/donate) or absolute URL. Leave blank to hide the donate button.",
      },
      {
        key: "join_form_url",
        label: "Join Form URL",
        type: "input",
        hint: "Relative (/contact) or absolute URL. Leave blank to hide the join link.",
      },
    ],
  },
];

// Flat list of all known keys in order
const ALL_KEYS = GROUPS.flatMap((g) => g.fields.map((f) => f.key));

// ── Component ────────────────────────────────────────────────────

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const [me, setMe] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [permError, setPermError] = useState("");

  // Form state
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [usingDefault, setUsingDefault] = useState<Record<string, boolean>>({});

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // ── Auth ─────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminMe().then((m) => {
      if (!m) { navigate("/admin/login"); return; }
      setMe(m);
    });
  }, [navigate]);

  // ── Load settings ────────────────────────────────────────────
  const loadSettings = useCallback(() => {
    adminFetch<{ values: Record<string, string>; usingDefault: Record<string, boolean> }>(
      "/api/admin/site-settings",
    )
      .then(({ values: v, usingDefault: ud }) => {
        setValues(v);
        setOriginal(v);
        setUsingDefault(ud);
      })
      .catch((err: Error) => {
        if (err.message.includes("403") || err.message.toLowerCase().includes("permission")) {
          setPermError("You don't have permission to manage site settings.");
        } else {
          setPermError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (me) loadSettings(); }, [me, loadSettings]);

  // ── Derived ──────────────────────────────────────────────────
  const isDirty = ALL_KEYS.some((k) => values[k] !== original[k]);
  const blankFields = ALL_KEYS.filter((k) => values[k] === "" && original[k] !== "");

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSavedAt(null);
    try {
      await adminFetch("/api/admin/site-settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      setOriginal({ ...values });
      setUsingDefault(Object.fromEntries(ALL_KEYS.map((k) => [k, false])));
      setSavedAt(new Date());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setSavedAt(null);
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (permError || !hasPermission(me, "settings")) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-10 w-10 text-destructive/60" />
        <p className="text-destructive font-semibold text-center">
          {permError || "You don't have permission to manage site settings."}
        </p>
        <Link href="/admin">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">

      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="hover:opacity-70 transition-opacity"><ArrowLeft className="h-5 w-5" /></button>
          </Link>
          <div>
            <h1 className="font-black text-base leading-none">Site Settings</h1>
            <p className="text-primary-foreground/50 text-xs mt-0.5">Albany Capital Region Lions Club</p>
          </div>
        </div>

        {/* Save button — top bar */}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold disabled:opacity-50"
        >
          {saving
            ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Saving…</>
            : <><Save className="h-4 w-4 mr-1.5" />Save All</>}
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-8 space-y-6">

        {/* Empty-value notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Empty fields are deliberate.</strong> Saving a blank value writes an explicit empty string to the database, overriding the built-in default. The public site will show nothing for that field — not a fallback. To restore a field's default, paste the original text back in.
          </p>
        </div>

        {/* Blanked-field warning (only when something was cleared) */}
        {blankFields.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
            <div className="text-sm text-orange-800">
              <strong>Heads up:</strong> the following field{blankFields.length > 1 ? "s" : ""} {blankFields.length > 1 ? "are" : "is"} now blank and will show as empty on the public site:{" "}
              <span className="font-mono">{blankFields.join(", ")}</span>.
            </div>
          </div>
        )}

        {/* Save feedback */}
        {saveError && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />{saveError}
          </div>
        )}
        {savedAt && !isDirty && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Settings saved at {savedAt.toLocaleTimeString()}.
          </div>
        )}

        {/* Groups */}
        {GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <section key={group.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Group header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
                <div className="bg-primary/10 text-primary rounded-lg p-1.5 shrink-0">
                  <GroupIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-black text-sm text-foreground">{group.label}</h2>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              </div>

              {/* Fields */}
              <div className="px-6 py-5 space-y-5">
                {group.fields.map((field) => {
                  const val = values[field.key] ?? "";
                  const isBlank = val === "";
                  const wasBlank = original[field.key] === "";
                  const changedToBlank = isBlank && !wasBlank;
                  const usedDefault = usingDefault[field.key] ?? false;

                  return (
                    <div key={field.key} className={field.narrow ? "max-w-xs" : ""}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="block text-xs font-bold text-foreground">{field.label}</label>
                        {usedDefault && (
                          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            using default
                          </span>
                        )}
                        {changedToBlank && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" /> will show empty
                          </span>
                        )}
                      </div>

                      {field.type === "textarea" ? (
                        <textarea
                          rows={field.rows ?? 3}
                          className={`w-full border rounded-lg px-3 py-2 text-sm bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                            changedToBlank
                              ? "border-orange-300 focus:ring-orange-200"
                              : "border-input"
                          }`}
                          value={val}
                          onChange={set(field.key)}
                        />
                      ) : (
                        <input
                          type={field.inputType ?? "text"}
                          className={`w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                            changedToBlank
                              ? "border-orange-300 focus:ring-orange-200"
                              : "border-input"
                          }`}
                          value={val}
                          onChange={set(field.key)}
                        />
                      )}

                      {field.hint && (
                        <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Bottom save bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border -mx-4 px-4 py-4 flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="bg-primary text-primary-foreground font-bold"
          >
            {saving
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              : <><Save className="h-4 w-4 mr-2" />Save All Changes</>}
          </Button>
          {isDirty && !saving && (
            <button
              onClick={() => { setValues({ ...original }); setSaveError(""); setSavedAt(null); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard changes
            </button>
          )}
          {savedAt && !isDirty && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Saved at {savedAt.toLocaleTimeString()}
            </span>
          )}
          {saveError && (
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />{saveError}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
