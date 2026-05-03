import jwt from "jsonwebtoken";

const SECRET = process.env["SESSION_SECRET"] ?? "fallback-dev-secret";

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AdminPayload {
  return jwt.verify(token, SECRET) as AdminPayload;
}
