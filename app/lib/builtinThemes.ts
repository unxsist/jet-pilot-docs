/*
 * The built-in themes as the site shows them. app/data/themes.json is synced
 * from the app (scripts/sync-themes.mjs); this layer keeps the /themes page
 * stable while built-ins are renamed there:
 *
 * - one "Built-in" group, ordered JET, the community themes, then JET Pilot's
 *   own palettes;
 * - ids that were renamed keep working in shareable links (?theme=<old id>).
 */
import type { ThemeOriginInfo, ThemePreset } from "./themeLook";

/** JET Pilot's own palettes besides JET, in picker order. */
export const JET_PALETTES: Record<string, string> = {
  blossom: "Blossom",
  grove: "Grove",
  ocean: "Ocean",
  ember: "Ember",
  iris: "Iris",
};

/** Ids built-ins had before they were renamed → their current id. */
export const LEGACY_THEME_IDS: Record<string, string> = {
  "t3-chat": "blossom",
  "t3-grove": "grove",
  "t3-ocean": "ocean",
  "t3-ember": "ember",
  "t3-iris": "iris",
};

const JET_ORIGIN: ThemeOriginInfo = { label: "JET Pilot", license: "MIT", author: "JET Pilot contributors" };

/** The current id for a theme id from a link (old ids are mapped). */
export const canonicalThemeId = (id: string) => LEGACY_THEME_IDS[id] ?? id;

/** JET and its sibling palettes: made by JET Pilot, not converted from elsewhere. */
export const isJetPalette = (preset: Pick<ThemePreset, "id" | "origin">) =>
  preset.id === "jet" || preset.id in JET_PALETTES || preset.origin?.label === "JET Pilot";

const PALETTE_ORDER = Object.keys(JET_PALETTES);
const rank = (preset: ThemePreset) =>
  preset.id === "jet" ? -1 : isJetPalette(preset) ? 1000 + (PALETTE_ORDER.indexOf(preset.id) + 1 || PALETTE_ORDER.length + 1) : 0;

export function builtinPresets(themes: ThemePreset[]): ThemePreset[] {
  return themes
    .map((theme): ThemePreset => {
      const id = canonicalThemeId(theme.id);
      const palette = JET_PALETTES[id];
      return {
        ...theme,
        id,
        name: palette ?? theme.name,
        group: "Built-in",
        origin: palette ? JET_ORIGIN : theme.origin,
      };
    })
    .map((theme, index) => ({ theme, index }))
    .sort((a, b) => rank(a.theme) - rank(b.theme) || a.index - b.index)
    .map(({ theme }) => theme);
}

/** Split a credits row ("Catppuccin (Latte, Mocha), …") into theme names, like the sync script. */
export const creditNames = (themes: string) =>
  themes
    .replace(/\([^)]*\)/g, "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
