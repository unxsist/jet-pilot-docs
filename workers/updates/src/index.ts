/*
 * updates.jet-pilot.app: serves the app's update manifest (latest.json,
 * published by the website at www.jet-pilot.app/latest.json) and counts the
 * app's update checks per day in D1 (./count.ts). It stores nothing but that
 * number: no request, IP address or anything else about anyone.
 *
 *   GET /latest.json   the manifest, counted
 *   GET /stats         the private stats page (HTTP Basic auth, any user
 *                      name, the STATS_PASSWORD secret as password)
 *   GET /stats.json    the same numbers as JSON
 *   anything else      redirects to www.jet-pilot.app
 */
import { isUpdateCheck } from "./count";
import { aggregate, dayOf, renderPage, type DayCount } from "./stats";

export interface Env {
  DB: D1Database;
  STATS_PASSWORD?: string;
}

const MANIFEST = "https://www.jet-pilot.app/latest.json";
const SITE = "https://www.jet-pilot.app/";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/latest.json" && (request.method === "GET" || request.method === "HEAD")) {
      if (request.method === "GET" && isUpdateCheck(request.headers)) ctx.waitUntil(record(env));
      return manifest(request.method);
    }
    if (url.pathname === "/stats" || url.pathname === "/stats.json") {
      if (!(await authorized(request, env))) {
        return new Response("Sign in to see the stats.", {
          status: 401,
          headers: { "www-authenticate": 'Basic realm="JET Pilot usage"', "cache-control": "no-store" },
        });
      }
      return stats(env, url.pathname.endsWith(".json"));
    }
    return Response.redirect(SITE, 301);
  },
} satisfies ExportedHandler<Env>;

async function manifest(method: string): Promise<Response> {
  const upstream = await fetch(MANIFEST, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!upstream.ok) return new Response("The update manifest is unavailable.", { status: 502 });
  return new Response(method === "HEAD" ? null : upstream.body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  });
}

/** Adds 1 to today's update checks; a failure only loses the count. */
async function record(env: Env): Promise<void> {
  try {
    await env.DB.prepare("INSERT INTO checks (day, n) VALUES (?, 1) ON CONFLICT (day) DO UPDATE SET n = n + 1")
      .bind(dayOf(new Date()))
      .run();
  } catch (e) {
    console.error("Counting the update check failed", e);
  }
}

async function authorized(request: Request, env: Env): Promise<boolean> {
  if (!env.STATS_PASSWORD) return false;
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  let password: string;
  try {
    password = atob(header.slice(6)).split(":").slice(1).join(":");
  } catch {
    return false;
  }
  const encoder = new TextEncoder();
  const [given, expected] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(password)),
    crypto.subtle.digest("SHA-256", encoder.encode(env.STATS_PASSWORD)),
  ]);
  return crypto.subtle.timingSafeEqual(given, expected);
}

async function stats(env: Env, json: boolean): Promise<Response> {
  const now = new Date();
  const since = dayOf(new Date(now.getTime() - 91 * 86_400_000));
  const rows = await env.DB.prepare("SELECT day, n FROM checks WHERE day >= ?").bind(since).all<DayCount>();
  const result = aggregate(now, rows.results);
  return json
    ? Response.json(result, { headers: { "cache-control": "no-store" } })
    : new Response(renderPage(result), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
}
