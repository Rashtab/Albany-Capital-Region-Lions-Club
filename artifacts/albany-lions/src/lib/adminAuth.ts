const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface AdminMember {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// ── Role / permission metadata ─────────────────────────────────

export const ROLE_LABELS: Record<string, string> = {
  president: "President",
  webmaster: "Webmaster",
  secretary: "Secretary",
  treasurer: "Treasurer",
  lcif_coordinator: "LCIF Coordinator",
};

export const ROLE_COLORS: Record<string, string> = {
  president: "bg-primary text-primary-foreground",
  webmaster: "bg-purple-600 text-white",
  secretary: "bg-blue-600 text-white",
  treasurer: "bg-emerald-600 text-white",
  lcif_coordinator: "bg-teal-600 text-white",
};

export const PERMISSION_LABELS: Record<string, string> = {
  all: "Full access to all management sections",
  members: "Member roster management",
  events: "Events & calendar management",
  content: "Blog, gallery & publications",
  donations: "Donations & fundraising records",
  sponsors: "Sponsor management",
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

export function hasPermission(member: AdminMember | null, permission: string): boolean {
  if (!member) return false;
  return member.permissions.includes("all") || member.permissions.includes(permission);
}

// ── Fetch helper (always sends session cookie) ─────────────────

export async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

// ── Auth calls ─────────────────────────────────────────────────

export async function fetchAdminMe(): Promise<AdminMember | null> {
  try {
    return await adminFetch<AdminMember>("/api/admin/me");
  } catch {
    return null;
  }
}

export async function adminLogin(email: string, password: string): Promise<AdminMember> {
  return adminFetch<AdminMember>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout(): Promise<void> {
  await adminFetch("/api/admin/logout", { method: "POST" });
}

// ── Form upload helper (multipart, session cookie) ─────────────

export async function adminFetchForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error((err as { error?: string }).error ?? "Upload failed");
  }
  return res.json() as Promise<T>;
}
