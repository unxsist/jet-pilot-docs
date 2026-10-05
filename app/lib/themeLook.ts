/*
 * What the /themes previewer needs from a resolved JET Pilot theme: the CSS
 * token triplets (same names as the app's stylesheet), a few role colours
 * for swatches, the terminal palette and the editor's syntax colours.
 *
 * Used at sync time (scripts/sync-themes.mjs → app/data/themes.json) and in
 * the browser for themes a visitor drops on the page. Pure data, no engine
 * import, so it stays out of the lazy engine chunk's way.
 */

export type Appearance = "light" | "dark";

export const ANSI = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite",
] as const;
export type Ansi = (typeof ANSI)[number];

export const SYNTAX = ["key", "string", "number", "constant", "comment", "punctuation", "text"] as const;
export type Syntax = (typeof SYNTAX)[number];

/** Roles kept for swatches and the theme chips. */
export const LOOK_ROLES = [
  "canvas",
  "sidebar",
  "surface",
  "surfaceOverlay",
  "text",
  "mutedForeground",
  "border",
  "accent",
  "accentSurface",
  "messageAction",
  "success",
  "warningForeground",
  "errorForeground",
  "info",
] as const;
export type LookRole = (typeof LOOK_ROLES)[number];

export interface ThemeLook {
  appearance: Appearance;
  /** CSS custom properties without "--", as bare HSL triplets ("240 5% 6.5%"). */
  vars: Record<string, string>;
  roles: Record<LookRole, string>;
  xterm: { background: string; foreground: string; cursor: string; selection: string } & Record<Ansi, string>;
  editor: { background: string; foreground: string; lineNumber: string; lineHighlight: string; selection: string };
  syntax: Record<Syntax, string>;
}

export interface ThemeOriginInfo {
  label: string;
  url?: string;
  license?: string;
  author?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  group: "Built-in" | "Yours";
  origin?: ThemeOriginInfo;
  looks: Partial<Record<Appearance, ThemeLook>>;
}

/** The subset of the engine's ResolvedTheme this module reads. */
export interface ResolvedLike {
  appearance: Appearance;
  roles: Record<string, string>;
  vars: Record<string, string>;
  monaco: { rules: { token: string; foreground?: string }[]; colors: Record<string, string> };
  xterm: Record<string, string>;
}

const SYNTAX_TOKENS: Record<Syntax, string> = {
  key: "key",
  string: "string",
  number: "number",
  constant: "constant",
  comment: "comment",
  punctuation: "delimiter",
  text: "",
};

const hash = (value: string | undefined, fallback: string) =>
  value ? (value.startsWith("#") || /[(\s]/.test(value) ? value : `#${value}`) : fallback;

export function toLook(resolved: ResolvedLike): ThemeLook {
  const { roles, monaco, xterm } = resolved;
  const rule = (token: string) => monaco.rules.find((r) => r.token === token)?.foreground;
  const colors = monaco.colors;
  return {
    appearance: resolved.appearance,
    vars: { ...resolved.vars },
    roles: Object.fromEntries(LOOK_ROLES.map((role) => [role, roles[role]])) as Record<LookRole, string>,
    xterm: {
      background: xterm.background!,
      foreground: xterm.foreground!,
      cursor: xterm.cursor!,
      selection: xterm.selectionBackground!,
      ...(Object.fromEntries(ANSI.map((name) => [name, xterm[name]])) as Record<Ansi, string>),
    },
    editor: {
      background: colors["editor.background"] ?? roles.canvas!,
      foreground: colors["editor.foreground"] ?? roles.text!,
      lineNumber: colors["editorLineNumber.foreground"] ?? roles.mutedForeground!,
      lineHighlight: colors["editor.lineHighlightBackground"] ?? "transparent",
      selection: colors["editor.selectionBackground"] ?? roles.accentSurface!,
    },
    syntax: Object.fromEntries(
      SYNTAX.map((slot) => [slot, hash(rule(SYNTAX_TOKENS[slot]), roles.text!)])
    ) as Record<Syntax, string>,
  };
}

/** Inline style for the previewer root: the app's token names, plus terminal / editor colours. */
export function lookStyle(look: ThemeLook): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [token, value] of Object.entries(look.vars)) style[`--${token}`] = value;
  for (const [name, value] of Object.entries(look.xterm)) style[`--term-${name}`] = value;
  for (const [name, value] of Object.entries(look.editor)) style[`--ed-${name}`] = value;
  for (const [name, value] of Object.entries(look.syntax)) style[`--syn-${name}`] = value;
  style["color-scheme"] = look.appearance;
  return style;
}
