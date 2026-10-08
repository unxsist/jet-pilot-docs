import { describe, expect, it } from "vitest";
import { aggregate, isoWeek, previousWeek, renderPage } from "../src/stats";

describe("weeks", () => {
  it("matches the app's ISO weeks", () => {
    expect(isoWeek("2026-10-08")).toBe("2026-W41");
    expect(isoWeek("2027-01-01")).toBe("2026-W53");
    expect(isoWeek("2024-12-30")).toBe("2025-W01");
  });

  it("finds the previous Monday-to-Sunday week", () => {
    expect(previousWeek("2026-10-08")).toEqual(["2026-09-28", "2026-10-04"]);
    expect(previousWeek("2026-10-05")).toEqual(["2026-09-28", "2026-10-04"]);
    expect(previousWeek("2026-10-04")).toEqual(["2026-09-21", "2026-09-27"]);
  });
});

describe("aggregate", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  const totals = [
    { day: "2026-10-07", kind: "day", n: 40 },
    { day: "2026-10-07", kind: "check", n: 55 },
    { day: "2026-10-07", kind: "plain", n: 300 },
    { day: "2026-10-05", kind: "week", n: 30 },
    { day: "2026-10-07", kind: "week", n: 12 },
    { day: "2026-10-01", kind: "month", n: 25 },
    { day: "2026-10-07", kind: "month", n: 20 },
    { day: "2026-09-30", kind: "month", n: 7 },
  ];
  const breakdown = [
    { version: "2.1.0", os: "linux", arch: "x86_64", n: 20 },
    { version: "2.1.0", os: "macos", arch: "aarch64", n: 15 },
    { version: "2.0.1", os: "linux", arch: "x86_64", n: 5 },
  ];
  const stats = aggregate(now, totals, breakdown, "2026-W40");

  it("sums weekly and monthly actives over their days", () => {
    expect(stats.weeks).toEqual([{ week: "2026-W41", actives: 42 }]);
    expect(stats.months).toEqual([
      { month: "2026-09", actives: 7 },
      { month: "2026-10", actives: 45 },
    ]);
  });

  it("lists the 90 full days before today, zero where nothing was counted, and today apart", () => {
    expect(stats.days).toHaveLength(90);
    expect(stats.days[0]!.day).toBe("2026-07-10");
    expect(stats.days.at(-1)).toEqual({ day: "2026-10-07", actives: 40, checks: 55, plain: 300 });
    expect(stats.days.at(-2)).toEqual({ day: "2026-10-06", actives: 0, checks: 0, plain: 0 });
    expect(stats.todaySoFar).toEqual({ day: "2026-10-08", actives: 0, checks: 0, plain: 0 });
  });

  it("groups versions and platforms, largest first", () => {
    expect(stats.versions).toEqual([
      { label: "2.1.0", n: 35 },
      { label: "2.0.1", n: 5 },
    ]);
    expect(stats.platforms).toEqual([
      { label: "Linux x86_64", n: 25 },
      { label: "macOS aarch64", n: 15 },
    ]);
  });

  it("renders the page with the numbers and escapes labels", () => {
    const html = renderPage(aggregate(now, totals, [{ version: "<b>", os: "linux", arch: "x86_64", n: 1 }], "2026-W40"));
    expect(html).toContain("&lt;b&gt;");
    expect(html).not.toContain("<b>");
    expect(html).toContain("Daily active");
  });
});
