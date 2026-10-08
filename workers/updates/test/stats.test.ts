import { describe, expect, it } from "vitest";
import { aggregate, lastDays, renderPage } from "../src/stats";

describe("aggregate", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  const stats = aggregate(now, [
    { day: "2026-10-08", n: 5 },
    { day: "2026-10-07", n: 40 },
    { day: "2026-10-01", n: 30 },
    { day: "2026-09-01", n: 20 },
  ]);

  it("lists the 90 full days before today, zero where nothing was counted, and today apart", () => {
    expect(stats.days).toHaveLength(90);
    expect(stats.days[0]!.day).toBe("2026-07-10");
    expect(stats.days.at(-1)).toEqual({ day: "2026-10-07", n: 40 });
    expect(stats.days.at(-2)).toEqual({ day: "2026-10-06", n: 0 });
    expect(stats.todaySoFar).toBe(5);
  });

  it("sums the last full days", () => {
    expect(lastDays(stats, 7)).toBe(70);
    expect(lastDays(stats, 30)).toBe(70);
    expect(lastDays(stats, 40)).toBe(90);
  });

  it("renders the page", () => {
    const html = renderPage(stats);
    expect(html).toContain("Last 7 days");
    expect(html).toContain("<td>2026-10-07</td><td>40</td>");
  });
});
