import { describe, expect, it } from "vitest";
import { countRows } from "../src/count";

const now = new Date("2026-10-08T09:30:00Z");
const counted = (headers: Record<string, string>) => countRows(new Headers(headers), now);
const app = { "X-JetPilot-Version": "2.1.0", "X-JetPilot-OS": "linux", "X-JetPilot-Arch": "x86_64" };

describe("countRows", () => {
  it("counts a first check of the day, week and month", () => {
    expect(counted({ ...app, "X-JetPilot-Count": "day,week,month" })).toEqual(
      ["check", "day", "week", "month"].map((kind) => ({ day: "2026-10-08", kind, version: "2.1.0", os: "linux", arch: "x86_64" }))
    );
  });

  it("counts a repeat check only as a check", () => {
    expect(counted({ ...app, "X-JetPilot-Count": "none" }).map((r) => r.kind)).toEqual(["check"]);
  });

  it("ignores unknown periods and stores unexpected labels as other", () => {
    const rows = counted({
      "X-JetPilot-Count": "day,year,<script>",
      "X-JetPilot-Version": "2.1.0; drop table",
      "X-JetPilot-OS": "plan9",
      "X-JetPilot-Arch": "x".repeat(200),
    });
    expect(rows.map((r) => r.kind)).toEqual(["check", "day"]);
    expect(rows[0]).toMatchObject({ version: "other", os: "other", arch: "other" });
  });

  it("keeps pre-release versions", () => {
    expect(counted({ ...app, "X-JetPilot-Version": "2.1.0-beta.1", "X-JetPilot-Count": "none" })[0]!.version).toBe("2.1.0-beta.1");
  });

  it("counts update checks without the headers as plain, with nothing else known", () => {
    expect(counted({ "User-Agent": "tauri-plugin-updater/2.13.1" })).toEqual([
      { day: "2026-10-08", kind: "plain", version: "unknown", os: "unknown", arch: "unknown" },
    ]);
  });

  it("does not count browsers, crawlers or Homebrew", () => {
    expect(counted({ "User-Agent": "Mozilla/5.0" })).toEqual([]);
    expect(counted({ "User-Agent": "Homebrew/4.6.0 curl/8.7.1" })).toEqual([]);
    expect(counted({})).toEqual([]);
  });
});
