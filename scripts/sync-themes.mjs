#!/usr/bin/env -S npx tsx
/*
 * Syncs the theme data the site needs from the JET Pilot app repository.
 * Run it after the app's theme engine, built-in themes or schema change:
 *
 *   npm run sync:themes                        # app at ../jet-pilot (npx tsx scripts/sync-themes.mjs)
 *   JET_PILOT_DIR=/path/to/jet-pilot npx tsx scripts/sync-themes.mjs
 *
 * Its outputs are committed, so the site's CI never needs the app repo:
 *   public/schemas/theme.json    THEME_JSON_SCHEMA, served at THEME_SCHEMA_URI
 *   app/data/themes.json         every built-in theme, resolved per appearance
 *                                (CSS tokens, swatch roles, terminal, syntax),
 *                                and the credits for the community themes
 *   app/data/theme-roles.json    the roles reference, from the schema descriptions
 *   app/vendor/jet-themes/       the theme engine (import → resolve → serialize)
 *                                for the "try your own theme" previewer; only
 *                                the modules it imports are copied
 *
 * It also checks that the examples in app/data/theme-examples.json import
 * and resolve with the real engine.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APP = resolve(process.env.JET_PILOT_DIR || join(SITE, "..", "jet-pilot"));
const THEMES = join(APP, "src/lib/themes");
const VENDOR = join(SITE, "app/vendor/jet-themes");

if (!existsSync(join(THEMES, "resolve.ts"))) {
  console.error(`No theme engine at ${THEMES}. Set JET_PILOT_DIR to the jet-pilot checkout.`);
  process.exit(1);
}

const load = (path) => import(pathToFileURL(join(THEMES, path)).href);
const write = (path, text) => {
  const file = join(SITE, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  console.log(`  wrote ${path} (${(Buffer.byteLength(text) / 1024).toFixed(1)} kB)`);
};

const [{ THEME_JSON_SCHEMA, THEME_SCHEMA_URI }, { resolveTheme }, { importTheme }, { JET_THEME }, { toLook }, { isJetPalette }] =
  await Promise.all([
    load("schema.ts"),
    load("resolve.ts"),
    load("import/index.ts"),
    load("builtin/jet.ts"),
    import(pathToFileURL(join(SITE, "app/lib/themeLook.ts")).href),
    import(pathToFileURL(join(SITE, "app/lib/builtinThemes.ts")).href),
  ]);

console.log(`Syncing themes from ${APP}`);

/* ------------------------------------------------------------ schema -- */

if (!THEME_SCHEMA_URI.startsWith("https://www.jet-pilot.app/")) {
  throw new Error(`THEME_SCHEMA_URI is ${THEME_SCHEMA_URI}; the site only serves https://www.jet-pilot.app/...`);
}
const schemaPath = new URL(THEME_SCHEMA_URI).pathname; // /schemas/theme.json
write(join("public", schemaPath), `${JSON.stringify({ ...THEME_JSON_SCHEMA, $id: THEME_SCHEMA_URI }, null, 2)}\n`);

/* ------------------------------------------------------- built-ins -- */

/* Copyright holders and upstream links from THIRD_PARTY_THEMES.md (community themes). */
const thirdParty = readFileSync(join(APP, "THIRD_PARTY_THEMES.md"), "utf8");
const credits = [];
for (const line of thirdParty.split("\n")) {
  const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
  if (cells.length !== 5 || cells[0] === "Theme" || /^-+$/.test(cells[0])) continue;
  const [themes, upstream, ref, license, copyright] = cells;
  const link = upstream.match(/\[([^\]]+)\]\(([^)]+)\)/);
  credits.push({
    themes,
    names: themes.replace(/\([^)]*\)/g, "").split(",").map((name) => name.trim()),
    upstream: link ? { label: link[1], url: link[2] } : { label: upstream },
    via: upstream.match(/via Open VSX `([^`]+)`/)?.[1],
    ref: ref.replace(/`/g, ""),
    license,
    copyright,
  });
}
const manifest = JSON.parse(readFileSync(join(THEMES, "builtin/manifest.json"), "utf8"));
const builtins = [
  { id: "jet", name: "JET", origin: { label: "JET Pilot", license: "MIT", author: "JET Pilot contributors" }, appearances: ["light", "dark"], file: JET_THEME },
  ...manifest.map((entry) => ({
    ...entry,
    file: JSON.parse(readFileSync(join(THEMES, "builtin/themes", `${entry.id}.json`), "utf8")),
  })),
];

/* JET Pilot's own palettes (JET and its siblings) need no third-party credit. */
const own = (id, origin) => isJetPalette({ id, origin });

const presets = builtins.map(({ id, name, origin, appearances, file }) => {
  const credit = own(id, origin) ? undefined : credits.find((c) => c.names.includes(name));
  if (!own(id, origin) && !credit) throw new Error(`No THIRD_PARTY_THEMES.md entry for ${name}`);
  const looks = {};
  for (const appearance of appearances) {
    const resolved = resolveTheme(file, appearance);
    if (resolved.appearance !== appearance) throw new Error(`${id} has no ${appearance} appearance`);
    looks[appearance] = toLook(resolved);
  }
  return {
    id,
    name,
    group: "Built-in",
    origin: { ...origin, ...(credit ? { author: credit.copyright.replace(/^Copyright\s*(\(c\)|©)?\s*[\d-]+(?:present)?\s*/i, "") } : {}) },
    looks,
  };
});

/* Only the rows for themes the site shows as community themes. */
const community = new Set(builtins.filter(({ id, origin }) => !own(id, origin)).map(({ name }) => name));
const communityCredits = credits.filter((c) => c.names.some((name) => community.has(name)));

write(
  "app/data/themes.json",
  `${JSON.stringify({ schemaUri: THEME_SCHEMA_URI, themes: presets, credits: communityCredits.map(({ names, ...c }) => c) })}\n`
);

/* ---------------------------------------------------- roles table -- */

const GROUPS = [
  ["surfaces", "Surfaces & lines", ["canvas", "surface", "surfaceRaised", "surfaceOverlay", "border", "input", "focus", "codeBackground", "codeForeground"]],
  ["text", "Text", ["text", "textMuted", "muted", "mutedForeground", "placeholder", "secondaryLabel", "iconMuted"]],
  ["accents", "Accent & actions", ["accent", "accentForeground", "accentSurface", "accentSurfaceForeground", "messageAction", "messageActionForeground", "messageActionHover", "secondary", "secondaryForeground"]],
  ["status", "Status", ["error", "errorForeground", "errorSurface", "warning", "warningForeground", "warningSurface", "update", "updateForeground", "updateSurface"]],
  ["sidebar", "Sidebar", ["sidebar", "sidebarForeground", "sidebarMutedForeground", "sidebarControlSurface", "sidebarRowHover", "sidebarRowActive", "sidebarRowSelected", "sidebarBorder"]],
  ["terminal", "Terminal", ["terminalBackground", "terminalForeground", "terminalCursor", "terminalSelection", "terminalScrollbar", "terminalScrollbarHover"]],
  ["chrome", "Window chrome", ["chrome", "toolbar", "toolbarForeground", "toolbarBorder", "toolbarControl", "toolbarControlForeground", "toolbarControlHover", "messageSurface", "messageForeground"]],
];
const colorRoles = THEME_JSON_SCHEMA.properties.colors.properties;
const jet = THEME_JSON_SCHEMA.properties.jetPilot.properties;
const grouped = new Set(GROUPS.flatMap(([, , roles]) => roles));
const ungrouped = Object.keys(colorRoles).filter((role) => !grouped.has(role));
const unknown = [...grouped].filter((role) => !(role in colorRoles));
if (unknown.length) throw new Error(`Roles no longer in the schema: ${unknown.join(", ")}`);
const entries = (props, path) =>
  Object.entries(props).map(([name, value]) => ({ name, path: `${path}.${name}`, description: value.description }));
const roleGroups = [
  ...GROUPS.map(([id, label, roles]) => ({
    id,
    label,
    roles: roles.map((role) => ({ name: role, path: `colors.${role}`, description: colorRoles[role].description })),
  })),
  ...(ungrouped.length
    ? [{ id: "other", label: "Other", roles: ungrouped.map((role) => ({ name: role, path: `colors.${role}`, description: colorRoles[role].description })) }]
    : []),
  { id: "jet", label: "JET Pilot extras", note: jet.colors.description, roles: entries(jet.colors.properties, "jetPilot.colors") },
  { id: "syntax", label: "Editor syntax", note: jet.syntax.description, roles: entries(jet.syntax.properties, "jetPilot.syntax") },
  { id: "ansi", label: "Terminal ANSI", note: jet.terminal.description, roles: entries(jet.terminal.properties, "jetPilot.terminal") },
];
if (ungrouped.length) console.warn(`  ! roles without a group (listed under "Other"): ${ungrouped.join(", ")}`);
write(
  "app/data/theme-roles.json",
  `${JSON.stringify({ groups: roleGroups, editor: jet.editor.description, tokens: jet.tokens.description }, null, 2)}\n`
);

/* ------------------------------------------------------ examples -- */

const examples = JSON.parse(readFileSync(join(SITE, "app/data/theme-examples.json"), "utf8"));
for (const [key, example] of Object.entries(examples)) {
  const result = importTheme(JSON.stringify(example));
  if (!result.ok) throw new Error(`Example "${key}" does not import: ${result.error}`);
  for (const appearance of ["light", "dark"]) resolveTheme(result.themes[0], appearance);
  console.log(`  example "${key}" ok (${result.format})`);
}

/* ------------------------------------------------- vendored engine -- */

/* Everything the previewer calls, and what those modules import (relative imports only). */
const ENTRIES = ["import/index.ts", "import/vscode.ts", "resolve.ts", "serialize.ts", "runtime.ts"];
const HEADER = "/* Synced from unxsist/jet-pilot src/lib/themes (MIT) by scripts/sync-themes.mjs — do not edit. */\n";
const closure = new Set();
const visit = (path) => {
  if (closure.has(path)) return;
  if (path.startsWith("builtin/")) throw new Error(`The engine imports a built-in (${path}); keep built-ins out of the vendored copy.`);
  closure.add(path);
  const text = readFileSync(join(THEMES, path), "utf8");
  for (const match of text.matchAll(/(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g)) {
    let target = relative(THEMES, resolve(dirname(join(THEMES, path)), match[1]));
    if (!target.endsWith(".ts")) target += ".ts";
    if (!existsSync(join(THEMES, target))) throw new Error(`${path} imports ${match[1]}, which is not a .ts module`);
    visit(target);
  }
};
ENTRIES.forEach(visit);

rmSync(VENDOR, { recursive: true, force: true });
for (const path of [...closure].sort()) {
  const file = join(VENDOR, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, HEADER + readFileSync(join(THEMES, path), "utf8"));
}
copyFileSync(join(APP, "LICENSE"), join(VENDOR, "LICENSE"));
console.log(`  vendored ${closure.size} engine modules into app/vendor/jet-themes: ${[...closure].sort().join(", ")}`);

/* Bare imports the vendored modules need must be site dependencies. */
const pkg = JSON.parse(readFileSync(join(SITE, "package.json"), "utf8"));
const bare = new Set();
for (const path of closure) {
  for (const match of readFileSync(join(THEMES, path), "utf8").matchAll(/^\s*(?:import|export)\b[^;]*?\bfrom\s*["']([^."'][^"']*)["']/gm)) {
    bare.add(match[1].startsWith("@") ? match[1].split("/").slice(0, 2).join("/") : match[1].split("/")[0]);
  }
}
const missing = [...bare].filter((name) => !pkg.dependencies?.[name]);
if (missing.length) throw new Error(`Add to the site's dependencies: ${missing.join(", ")}`);
console.log(`  engine dependencies present: ${[...bare].join(", ")}`);
console.log("Done.");
