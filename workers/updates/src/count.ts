/*
 * What one update check adds to the daily totals. The app (jet-pilot
 * src/lib/usage.ts) sends, on its startup check only:
 *
 *   X-JetPilot-Count    the periods this is the install's first check of:
 *                       "day,week,month", a subset, or "none"
 *   X-JetPilot-Version  the app version
 *   X-JetPilot-OS       linux | macos | windows
 *   X-JetPilot-Arch     x86_64 | aarch64 | …
 *
 * Every counted check adds 1 to `check`, and to `day`, `week` and `month` for
 * the periods it is the first of: summing those gives the daily, weekly and
 * monthly active installs. Checks without the headers (versions before
 * counting, installs that turned it off, manual checks) add 1 to `plain`,
 * with nothing else known. Values outside the known set become "other", so
 * nothing a client sends is stored verbatim.
 */

export type Kind = "check" | "day" | "week" | "month" | "plain";

export interface CountRow {
  day: string;
  kind: Kind;
  version: string;
  os: string;
  arch: string;
}

const PERIODS = ["day", "week", "month"] as const;
const OS = new Set(["linux", "macos", "windows"]);
const ARCH = new Set(["x86_64", "aarch64", "x86", "arm"]);
const VERSION = /^\d{1,3}\.\d{1,3}\.\d{1,3}(?:-[0-9A-Za-z.]{1,20})?$/;
/** The app's updater (tauri-plugin-updater) names itself in its user agent. */
const UPDATER = /^tauri-plugin-updater\//;

export function countRows(headers: Headers, now: Date): CountRow[] {
  const day = now.toISOString().slice(0, 10);
  const count = headers.get("x-jetpilot-count");

  if (count === null) {
    // Only the app's own update checks: not browsers, crawlers or Homebrew's livecheck.
    if (!UPDATER.test(headers.get("user-agent") ?? "")) return [];
    return [{ day, kind: "plain", version: "unknown", os: "unknown", arch: "unknown" }];
  }

  const version = headers.get("x-jetpilot-version") ?? "";
  const os = headers.get("x-jetpilot-os") ?? "";
  const arch = headers.get("x-jetpilot-arch") ?? "";
  const labels = {
    day,
    version: VERSION.test(version) ? version : "other",
    os: OS.has(os) ? os : "other",
    arch: ARCH.has(arch) ? arch : "other",
  };
  const first = new Set(count.split(",").map((p) => p.trim()));
  return [
    { ...labels, kind: "check" },
    ...PERIODS.filter((p) => first.has(p)).map((kind) => ({ ...labels, kind })),
  ];
}
