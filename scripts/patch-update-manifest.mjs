/*
 * Writes the notes of public/latest.json (downloaded from the latest GitHub
 * release at deploy time, see .github/workflows/deploy.yml), which the update
 * dialog of every installed JET Pilot shows:
 *
 *   1. notices/update-notice.md, when there is something every updating
 *      client should read (e.g. how to get past a broken updater in versions
 *      that predate the announcements feed). Leave it empty otherwise.
 *   2. The release's entry from the app's CHANGELOG.md, the same curated
 *      text as jet-pilot.app/changelog, instead of the generated list of
 *      commits. Without an entry for the version, the release notes stay.
 *
 *   node scripts/patch-update-manifest.mjs [--changelog <path or URL>]
 *   (default: ../jet-pilot/CHANGELOG.md, or JET_PILOT_DIR)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(SITE, "public/latest.json");
const NOTICE = join(SITE, "notices/update-notice.md");
const CHANGELOG_PAGE = "https://www.jet-pilot.app/changelog/";

const args = process.argv.slice(2);
const source = args.includes("--changelog")
  ? args[args.indexOf("--changelog") + 1]
  : join(resolve(process.env.JET_PILOT_DIR || join(SITE, "..", "jet-pilot")), "CHANGELOG.md");

async function readChangelog() {
  try {
    if (/^https?:\/\//.test(source)) {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    }
    return readFileSync(source, "utf8");
  } catch (error) {
    console.warn(`::warning::No changelog from ${source} (${error.message}); the release notes stay.`);
    return "";
  }
}

/** The body of `## <version> (...)` up to the next release, without comments. */
function entry(changelog, version) {
  const text = changelog.replace(/<!--[\s\S]*?-->/g, "");
  const escaped = version.replace(/\./g, "\\.");
  const match = text.match(new RegExp(`^## ${escaped} \\(.*\\)$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
  return match ? match[1].trim() : "";
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const notice = existsSync(NOTICE) ? readFileSync(NOTICE, "utf8").trim() : "";
const curated = entry(await readChangelog(), manifest.version);
const notes = curated ? `${curated}\n\n[Everything that changed](${CHANGELOG_PAGE})` : manifest.notes;

manifest.notes = [notice, notes].filter(Boolean).join("\n\n");
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `Notes of ${manifest.version}: ${notice ? "update notice + " : ""}${curated ? "its CHANGELOG.md entry" : "the release notes"}.`
);
