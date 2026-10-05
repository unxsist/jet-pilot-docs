/*
 * Prepends notices/update-notice.md to the release notes in
 * public/latest.json (downloaded from the latest GitHub release at deploy
 * time, see .github/workflows/deploy.yml).
 *
 * The update dialog of every installed JET Pilot shows these notes, so this
 * reaches versions that predate the announcements feed
 * (public/announcements.json), e.g. to explain how to get past a broken
 * updater. Leave the notice empty (or delete it) when there is nothing to say.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const MANIFEST = "public/latest.json";
const NOTICE = "notices/update-notice.md";

const notice = existsSync(NOTICE) ? readFileSync(NOTICE, "utf8").trim() : "";
if (!notice) {
  console.log("No update notice, latest.json left as is.");
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
manifest.notes = [notice, manifest.notes].filter(Boolean).join("\n\n");
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Prepended ${NOTICE} to the notes of ${manifest.version}.`);
