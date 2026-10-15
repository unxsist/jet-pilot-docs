#!/usr/bin/env node
/*
 * Builds the /changelog/ page's data from the app's CHANGELOG.md:
 *
 *   npm run sync:changelog                       # app at ../jet-pilot
 *   JET_PILOT_DIR=/path/to/jet-pilot npm run sync:changelog
 *   node scripts/sync-changelog.mjs --url <raw CHANGELOG.md URL>   # deploy.yml
 *   npm run sync:changelog -- --unreleased       # preview entries ahead of a release (don't commit)
 *
 * Writes app/data/changelog.json (committed, so local builds work offline;
 * every deploy refreshes it from the app's main branch). Only released
 * versions are kept: entries above the latest published release's version
 * (its latest.json) are written ahead of a release and stay off the site.
 *
 * The format is described at the top of CHANGELOG.md; anything else is an
 * error, so a typo fails here instead of rendering oddly.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APP = resolve(process.env.JET_PILOT_DIR || join(SITE, "..", "jet-pilot"));
const OUT = join(SITE, "app/data/changelog.json");
const LATEST_URL = "https://github.com/unxsist/jet-pilot/releases/latest/download/latest.json";

const args = process.argv.slice(2);
const url = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;
if (args.includes("--url") && !url) throw new Error("--url needs the changelog's URL.");

async function readSource() {
  if (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.text();
  }
  const file = join(APP, "CHANGELOG.md");
  if (!existsSync(file)) throw new Error(`No changelog at ${file}. Set JET_PILOT_DIR to the jet-pilot checkout.`);
  return readFileSync(file, "utf8");
}

/** The version of the latest published release; public/latest.json when offline. */
async function releasedVersion() {
  try {
    const response = await fetch(LATEST_URL);
    if (response.ok) return (await response.json()).version;
  } catch {
    // Offline: fall through to the copy deploy.yml downloads.
  }
  const local = join(SITE, "public/latest.json");
  if (existsSync(local)) {
    console.warn("Couldn't fetch the latest release; using public/latest.json, which may be older.");
    return JSON.parse(readFileSync(local, "utf8")).version;
  }
  throw new Error("Couldn't tell which version is released.");
}

const parts = (version) => version.split(".").map(Number);
const newer = (a, b) => {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

const md = new MarkdownIt({ html: true, linkify: false, typographer: true });
const GROUPS = ["New", "Improved", "Fixed", "Upgrading"];

function parse(text) {
  const lines = text.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/);
  const releases = [];
  let release = null;
  let group = null;
  let paragraph = [];
  const fail = (n, message) => {
    throw new Error(`CHANGELOG.md line ${n + 1}: ${message}`);
  };
  const flushParagraph = () => {
    if (paragraph.length) release.intro.push(paragraph.join(" "));
    paragraph = [];
  };

  lines.forEach((line, n) => {
    if (line.startsWith("## ")) {
      if (release) flushParagraph();
      const match = line.match(/^## (\d+\.\d+\.\d+) \((\d{4}-\d{2}-\d{2})\)$/);
      if (!match) fail(n, `expected "## <version> (<YYYY-MM-DD>)", got "${line}"`);
      release = { version: match[1], date: match[2], title: null, intro: [], groups: [] };
      group = null;
      releases.push(release);
      return;
    }
    if (!release) return; // The page writes its own header.
    if (line.startsWith("#### ")) {
      flushParagraph();
      const name = line.slice(5).trim();
      if (!GROUPS.includes(name)) fail(n, `unknown group "${name}" (use ${GROUPS.join(", ")})`);
      group = { name, items: [] };
      release.groups.push(group);
      return;
    }
    if (line.startsWith("### ")) {
      if (release.title || release.groups.length) fail(n, "a release has one title, before its groups");
      release.title = line.slice(4).trim();
      return;
    }
    if (line.startsWith("- ")) {
      if (!group) fail(n, "list items belong under a #### group");
      group.items.push(line.slice(2).trim());
      return;
    }
    if (/^\s+\S/.test(line) && group?.items.length) {
      group.items[group.items.length - 1] += ` ${line.trim()}`;
      return;
    }
    if (!line.trim()) {
      if (!group) flushParagraph();
      return;
    }
    if (group) fail(n, "text after a group must be a list item");
    paragraph.push(line.trim());
  });
  if (release) flushParagraph();
  return releases;
}

function validate(releases) {
  if (!releases.length) throw new Error("CHANGELOG.md has no releases.");
  releases.forEach((release, i) => {
    const patch = parts(release.version)[2] !== 0;
    if (!patch && !release.title) throw new Error(`${release.version}: feature releases need a ### title.`);
    if (patch && (release.title || release.intro.length))
      throw new Error(`${release.version}: patch releases have no title or intro.`);
    if (!release.groups.length || release.groups.some((g) => !g.items.length))
      throw new Error(`${release.version}: every release needs at least one group, and groups need items.`);
    const next = releases[i + 1];
    if (next && !newer(release.version, next.version))
      throw new Error(`${release.version} is listed above ${next.version}: newest first.`);
  });
}

const releases = parse(await readSource());
validate(releases);
const released = await releasedVersion();
const shown = args.includes("--unreleased")
  ? releases
  : releases.filter((release) => !newer(release.version, released));
const held = releases.length - shown.length;

const data = {
  releases: shown.map((release) => ({
    version: release.version,
    date: release.date,
    kind: parts(release.version)[2] !== 0 ? "patch" : parts(release.version)[1] === 0 ? "major" : "minor",
    title: release.title ? md.renderInline(release.title) : null,
    intro: release.intro.map((text) => md.renderInline(text)),
    groups: release.groups.map((group) => ({
      name: group.name,
      items: group.items.map((item) => md.renderInline(item)),
    })),
  })),
};

writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `Wrote ${shown.length} releases (${shown.at(-1).version} to ${shown[0].version}) to ${OUT}` +
    (held ? `; held back ${held} unreleased (latest release: ${released}).` : ".")
);
