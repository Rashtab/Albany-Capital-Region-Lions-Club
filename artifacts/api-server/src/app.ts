import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

// Trust the Replit reverse proxy (needed for correct IP forwarding + cookie security)
app.set("trust proxy", 1);

// ── Canonical domain redirect ────────────────────────────────────
// Any request arriving via the *.replit.app hostname gets a permanent
// 301 redirect to the canonical domain so Google doesn't index both.
const CANONICAL_HOST = "albanylionsclub.org";
app.use((req, res, next) => {
  const host = (req.headers["x-forwarded-host"] as string | undefined)
    ?? req.headers["host"]
    ?? "";
  const bare = host.split(":")[0].toLowerCase();
  if (bare && bare !== CANONICAL_HOST && bare.endsWith(".replit.app")) {
    const target = `https://${CANONICAL_HOST}${req.originalUrl}`;
    res.redirect(301, target);
    return;
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware — must come before routes
app.use(
  session({
    secret: process.env["SESSION_SECRET"] ?? "fallback-dev-secret",
    resave: false,
    saveUninitialized: false,
    name: "lions_sid",
    cookie: {
      httpOnly: true,
      // false because the Replit proxy terminates TLS; the browser sees HTTPS
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", router);

export default app;
