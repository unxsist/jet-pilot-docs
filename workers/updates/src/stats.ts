/*
 * The private stats page: update checks per day (./count.ts). The app checks
 * for updates when it starts, so the numbers follow how often JET Pilot is
 * started; one person starting it three times counts three times.
 */

export interface DayCount {
  day: string;
  n: number;
}

export interface Stats {
  today: string;
  /** The 90 full days before today, oldest first. */
  days: DayCount[];
  todaySoFar: number;
}

const DAY = 86_400_000;

export const dayOf = (date: Date) => date.toISOString().slice(0, 10);

export function aggregate(now: Date, rows: DayCount[]): Stats {
  const today = dayOf(now);
  const byDay = new Map(rows.map((r) => [r.day, r.n]));
  const days = Array.from({ length: 90 }, (_, i) => {
    const day = dayOf(new Date(now.getTime() - (90 - i) * DAY));
    return { day, n: byDay.get(day) ?? 0 };
  });
  return { today, days, todaySoFar: byDay.get(today) ?? 0 };
}

/** The sum of the last `count` full days. */
export const lastDays = (stats: Stats, count: number) => stats.days.slice(-count).reduce((sum, d) => sum + d.n, 0);

/* ------------------------------------------------------------------ page -- */


const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const fmt = (n: number) => n.toLocaleString("en-GB");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const shortDay = (day: string) => `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]!.slice(0, 3)}`;

/** Rounds a maximum up to a readable axis top (1, 2, 2.5, 5 × 10ⁿ). */
function niceMax(max: number): number {
  if (max <= 4) return 4;
  const power = 10 ** Math.floor(Math.log10(max));
  return ([1, 2, 2.5, 5, 10].find((m) => m * power >= max) ?? 10) * power;
}

/** A single-series line chart over days, with a crosshair readout (see the page script). */
function lineChart(id: string, title: string, points: { day: string; value: number }[], unit: string): string {
  const W = 880, H = 220, L = 48, R = 12, T = 12, B = 28;
  const top = niceMax(Math.max(0, ...points.map((p) => p.value)));
  const x = (i: number) => L + (i * (W - L - R)) / Math.max(1, points.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / top);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
  const grid = [0, 0.5, 1]
    .map((f) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(top * f)}" y2="${y(top * f)}"/><text class="tick" x="${L - 8}" y="${y(top * f) + 4}" text-anchor="end">${fmt(top * f)}</text>`)
    .join("");
  const ticks = points
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => (points.length - 1 - i) % 14 === 0)
    .map(({ p, i }) => `<text class="tick" x="${x(i)}" y="${H - 8}" text-anchor="${i === points.length - 1 ? "end" : "middle"}">${shortDay(p.day)}</text>`)
    .join("");
  const data = escape(JSON.stringify(points.map((p) => [shortDay(p.day), p.value])));
  return `<figure class="chart" id="${id}">
  <figcaption>${escape(title)}</figcaption>
  <div class="plot" data-points="${data}" data-unit="${escape(unit)}" data-left="${L}" data-right="${R}" data-top="${T}" data-bottom="${B}" data-max="${top}">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(title)}">${grid}${ticks}
      <path class="line" d="${path}"/>
      <line class="cross" y1="${T}" y2="${H - B}" visibility="hidden"/>
      <circle class="dot" r="4" visibility="hidden"/>
    </svg>
    <div class="tip" hidden></div>
  </div>
</figure>`;
}

function tile(label: string, value: number, note: string): string {
  return `<div class="tile"><div class="tile-label">${escape(label)}</div><div class="tile-value">${fmt(value)}</div><div class="muted">${escape(note)}</div></div>`;
}

export function renderPage(stats: Stats): string {
  const week = lastDays(stats, 7);
  const month = lastDays(stats, 30);
  const table = stats.days
    .slice()
    .reverse()
    .map((d) => `<tr><td>${d.day}</td><td>${fmt(d.n)}</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>JET Pilot usage</title>
<style>
:root {
  color-scheme: light;
  --surface: #fcfcfb; --raised: #ffffff; --line: #e6e5e0; --grid: #efeee9;
  --text: #0b0b0b; --text-2: #52514e; --muted: #7a7974; --series: #2a78d6;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --surface: #1a1a19; --raised: #222221; --line: #33332f; --grid: #2a2a27;
    --text: #ffffff; --text-2: #c3c2b7; --muted: #8f8e86; --series: #3987e5;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--surface); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 960px; margin: 0 auto; padding: 40px 24px 64px; }
h1 { font-size: 20px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.sub { color: var(--muted); margin: 4px 0 32px; }
.muted { color: var(--muted); }
.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 40px; }
@media (max-width: 560px) { .tiles { grid-template-columns: 1fr; } }
.tile { border: 1px solid var(--line); border-radius: 10px; padding: 16px; background: var(--raised); }
.tile-label { color: var(--text-2); }
.tile-value { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin: 2px 0; }
figure { margin: 0 0 40px; }
figcaption { font-weight: 600; margin-bottom: 12px; }
.plot { position: relative; overflow-x: auto; }
.plot svg { min-width: 640px; }
svg { display: block; width: 100%; height: auto; overflow: visible; }
.grid { stroke: var(--grid); stroke-width: 1; }
.tick { fill: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.line { fill: none; stroke: var(--series); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.cross { stroke: var(--muted); stroke-width: 1; }
.dot { fill: var(--series); stroke: var(--surface); stroke-width: 2; }
.tip { position: absolute; top: 0; pointer-events: none; background: var(--raised); border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; white-space: nowrap; box-shadow: 0 4px 16px rgb(0 0 0 / 0.12); }
.tip strong { font-variant-numeric: tabular-nums; }
details { border-top: 1px solid var(--line); padding-top: 16px; }
summary { cursor: pointer; color: var(--text-2); }
table { border-collapse: collapse; width: 100%; margin-top: 12px; font-variant-numeric: tabular-nums; }
th, td { text-align: right; padding: 4px 8px; border-bottom: 1px solid var(--line); }
th:first-child, td:first-child { text-align: left; }
th { color: var(--text-2); font-weight: 500; }
.note { color: var(--muted); max-width: 640px; }
</style>
</head>
<body>
<main>
  <h1>JET Pilot usage</h1>
  <p class="sub">Update checks per day. JET Pilot checks for updates when it starts, so this follows how often it's used. Days are UTC.</p>

  <section class="tiles">
    ${tile("Yesterday", stats.days.at(-1)!.n, `${fmt(stats.todaySoFar)} today so far`)}
    ${tile("Last 7 days", week, `${fmt(Math.round(week / 7))} a day`)}
    ${tile("Last 30 days", month, `${fmt(Math.round(month / 30))} a day`)}
  </section>

  ${lineChart("daily", "Update checks per day, last 90 days", stats.days.map((d) => ({ day: d.day, value: d.n })), "checks")}
  <p class="note">Counted: the app's update checks on startup and when someone checks by hand. Not counted: apps with the startup check turned off, browsers and Homebrew. One person starting the app three times counts three times.</p>

  <details>
    <summary>All days as a table</summary>
    <table>
      <thead><tr><th>Day</th><th>Update checks</th></tr></thead>
      <tbody>${table}</tbody>
    </table>
  </details>
</main>
<script>
for (const plot of document.querySelectorAll(".plot")) {
  const points = JSON.parse(plot.dataset.points);
  // On narrow screens the plot scrolls: start at the latest days.
  plot.scrollLeft = plot.scrollWidth;
  const svg = plot.querySelector("svg");
  const cross = svg.querySelector(".cross");
  const dot = svg.querySelector(".dot");
  const tip = plot.querySelector(".tip");
  const [W, H] = svg.viewBox.baseVal ? [svg.viewBox.baseVal.width, svg.viewBox.baseVal.height] : [880, 220];
  const L = +plot.dataset.left, R = +plot.dataset.right, T = +plot.dataset.top, B = +plot.dataset.bottom, max = +plot.dataset.max;
  const hide = () => { cross.setAttribute("visibility", "hidden"); dot.setAttribute("visibility", "hidden"); tip.hidden = true; };
  svg.addEventListener("pointerleave", hide);
  svg.addEventListener("pointermove", (event) => {
    const box = svg.getBoundingClientRect();
    const vx = ((event.clientX - box.left) / box.width) * W;
    const i = Math.max(0, Math.min(points.length - 1, Math.round(((vx - L) / (W - L - R)) * (points.length - 1))));
    const x = L + (i * (W - L - R)) / (points.length - 1);
    const y = T + (H - T - B) * (1 - points[i][1] / max);
    cross.setAttribute("x1", x); cross.setAttribute("x2", x); cross.setAttribute("visibility", "visible");
    dot.setAttribute("cx", x); dot.setAttribute("cy", y); dot.setAttribute("visibility", "visible");
    tip.replaceChildren();
    const value = document.createElement("strong");
    value.textContent = points[i][1].toLocaleString("en-GB") + " " + plot.dataset.unit;
    const day = document.createElement("div");
    day.className = "muted";
    day.textContent = points[i][0];
    tip.append(value, day);
    tip.hidden = false;
    const px = (x / W) * box.width;
    tip.style.left = Math.min(box.width - tip.offsetWidth, Math.max(0, px - tip.offsetWidth / 2)) + "px";
    tip.style.top = Math.max(0, (y / H) * box.height - tip.offsetHeight - 14) + "px";
  });
}
</script>
</body>
</html>`;
}
