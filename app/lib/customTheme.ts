/*
 * "Try your own theme": the vendored JET Pilot theme engine, end to end.
 * Only ever loaded with a dynamic import() from the /themes page, so the
 * engine (culori, jsonc-parser, fast-plist) is its own lazy chunk.
 */
import { importTheme } from "~/vendor/jet-themes/import/index";
import { pairVariants } from "~/vendor/jet-themes/import/vscode";
import { resolveTheme } from "~/vendor/jet-themes/resolve";
import { themeAppearances, themeIdFromName } from "~/vendor/jet-themes/runtime";
import { serializeTheme } from "~/vendor/jet-themes/serialize";
import type { ImportFormat, ThemeFile } from "~/vendor/jet-themes/types";
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
  t3: string;
}

export type ImportOutcome =
  | { ok: true; format: string; themes: ImportedTheme[]; warnings: string[] }
  | { ok: false; error: string };

const FORMATS: Record<ImportFormat, string> = {
  jet: "JET Pilot theme",
  t3: "T3 Code theme",
  vscode: "VS Code theme",
  sublime: "Sublime Text colour scheme",
  tmtheme: "TextMate theme",
};

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
    t3: serializeTheme(file, { forT3: true }),
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
    formats.add(FORMATS[result.format]);
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
