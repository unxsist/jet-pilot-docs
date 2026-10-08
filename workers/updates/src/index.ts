/*
 * updates.jet-pilot.app: serves the app's update manifest (latest.json,
 * published by the website at www.jet-pilot.app/latest.json) and counts the
 * update checks as daily totals in D1 (./count.ts). It never stores a
 * request, an IP address or anything else about a single install.
 *
 *   GET /latest.json   the manifest, counted
 *   GET /stats         the private stats page (HTTP Basic auth, any user
 *                      name, the STATS_PASSWORD secret as password)
 *   GET /stats.json    the same numbers as JSON
 *   anything else      redirects to www.jet-pilot.app
 */
import { countRows } from "./count";
import { aggregate, dayOf, isoWeek, previousWeek, renderPage, type Breakdown, type DayTotal } from "./stats";

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
      if (request.method === "GET") ctx.waitUntil(record(env, request.headers));
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

/** Adds this check to the daily totals; a failure only loses the count. */
async function record(env: Env, headers: Headers): Promise<void> {
  const rows = countRows(headers, new Date());
  if (!rows.length) return;
  const insert = env.DB.prepare(
    "INSERT INTO counts (day, kind, version, os, arch, n) VALUES (?, ?, ?, ?, ?, 1) " +
      "ON CONFLICT (day, kind, version, os, arch) DO UPDATE SET n = n + 1"
  );
  try {
    await env.DB.batch(rows.map((r) => insert.bind(r.day, r.kind, r.version, r.os, r.arch)));
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
  // Enough for 13 months of monthly actives.
  const since = dayOf(new Date(now.getTime() - 400 * 86_400_000));
  const [weekStart, weekEnd] = previousWeek(dayOf(now));

  const totals = await env.DB.prepare(
    "SELECT day, kind, SUM(n) AS n FROM counts WHERE day >= ? GROUP BY day, kind"
  )
    .bind(since)
    .all<DayTotal>();
  // Versions and platforms of the last full week, or of this week while that one has no counts.
  const byWeek = (from: string, to: string) =>
    env.DB.prepare(
      "SELECT version, os, arch, SUM(n) AS n FROM counts WHERE kind = 'week' AND day BETWEEN ? AND ? GROUP BY version, os, arch"
    )
      .bind(from, to)
      .all<Breakdown>();
  let week = isoWeek(weekStart);
  let breakdown = (await byWeek(weekStart, weekEnd)).results;
  if (!breakdown.length) {
    week = `${isoWeek(dayOf(now))} so far`;
    breakdown = (await byWeek(dayOf(new Date(new Date(weekEnd).getTime() + 86_400_000)), dayOf(now))).results;
  }

  const result = aggregate(now, totals.results, breakdown, week);
  return json
    ? Response.json(result, { headers: { "cache-control": "no-store" } })
    : new Response(renderPage(result), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
}
