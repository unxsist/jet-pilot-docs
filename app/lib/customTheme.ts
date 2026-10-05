/*
 * "Try your own theme": the vendored JET Pilot theme engine, end to end.
 * Only ever loaded with a dynamic import() from the /themes page, so the
 * engine (culori, jsonc-parser, fast-plist) is its own lazy chunk.
 */
import { importTheme } from "~/vendor/jet-themes/import/index";
import { pairVariants } from "~/vendor/jet-themes/import/vscode";
import { resolveTheme } from "~/vendor/jet-themes/resolve";
import { RESERVED_THEME_IDS, themeAppearances, themeIdFromName } from "~/vendor/jet-themes/runtime";
import { serializeTheme } from "~/vendor/jet-themes/serialize";
import { THEME_COLOR_ROLES, type ThemeFile } from "~/vendor/jet-themes/types";
import { toLook, type ThemeLook, type ThemePreset } from "./themeLook";

export interface ThemeSource {
  name?: string;
  text: string;
}

export interface ImportedTheme {
  preset: ThemePreset;
  /** File name for the JET Pilot download. */
  fileName: string;
  jet: string;
  /** The standard theme file: every role resolved, no JET Pilot-only extras. */
  standard: string;
}

export type ImportOutcome =
  | { ok: true; format: string; themes: ImportedTheme[]; warnings: string[] }
  | { ok: false; error: string };

/* Every other format the engine reports is a plain theme file. */
const FORMATS: Record<string, string> = {
  vscode: "VS Code theme",
  sublime: "Sublime Text colour scheme",
  tmtheme: "TextMate theme",
};
const formatLabel = (format: string) => FORMATS[format] ?? "JET Pilot theme";

/*
 * The standard theme file: version 1, every colour role resolved as hex for
 * the base appearance and each variant, and no `jetPilot` block — for tools
 * that only read the standard roles.
 */
function standardTheme(file: ThemeFile): string {
  const roles = (appearance: ThemeFile["appearance"]) => {
    const resolved = resolveTheme(file, appearance).roles;
    return Object.fromEntries(THEME_COLOR_ROLES.map((role) => [role, resolved[role]]));
  };
  let id = file.id ?? themeIdFromName(file.name);
  if (RESERVED_THEME_IDS.has(id)) id = `${id}-theme`;
  const variants = Object.fromEntries(
    themeAppearances(file)
      .filter((appearance) => appearance !== file.appearance)
      .map((appearance) => [appearance, roles(appearance)])
  );
  const value = {
    version: 1,
    id,
    name: file.name.trim(),
    appearance: file.appearance,
    colors: roles(file.appearance),
    ...(Object.keys(variants).length ? { variants } : {}),
  };
  return `${JSON.stringify(value, null, 2)}\n`;
}

function toImported(file: ThemeFile, index: number): ImportedTheme {
  const looks: ThemePreset["looks"] = {};
  for (const appearance of themeAppearances(file)) {
    looks[appearance] = toLook(resolveTheme(file, appearance)) as ThemeLook;
  }
  const id = file.id ?? themeIdFromName(file.name);
  return {
    preset: {
      id: `yours-${index}-${id}`,
      name: file.name,
      group: "Yours",
      origin: file.origin ? { ...file.origin } : undefined,
      looks,
    },
    fileName: `${id}.json`,
    jet: serializeTheme(file),
    standard: standardTheme(file),
  };
}

/** Imports one or more files (a light and a dark file pair up, like in the app). */
export function importThemes(sources: ThemeSource[]): ImportOutcome {
  const files: ThemeFile[] = [];
  const warnings: string[] = [];
  const formats = new Set<string>();
  for (const source of sources) {
    const result = importTheme(source.text, source.name);
    if (!result.ok) {
      const where = sources.length > 1 && source.name ? `${source.name}: ` : "";
      return { ok: false, error: `${where}${result.error}` };
    }
    formats.add(formatLabel(result.format));
    files.push(...result.themes);
    warnings.push(...result.warnings.map((w) => (sources.length > 1 && source.name ? `${source.name}: ${w}` : w)));
  }
  if (!files.length) return { ok: false, error: "No theme found in the file." };
  const paired = files.length > 1 ? pairVariants(files) : files;
  try {
    return { ok: true, format: [...formats].join(" + "), themes: paired.map(toImported), warnings };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
