/*
 * Builds the site's app screenshots from 6x masters (1440×900 windows
 * captured at deviceScaleFactor 6, 8640×5400 PNG: the app repo's
 * dev/harness/site-shots.mjs makes them).
 *
 *   npm run shots -- <masters-dir> [name...]
 *
 * For every <name>-<dark|light>.png it writes public/images/app/
 * <name>-<theme>-<1280|2400|3600>.<avif|webp>, and for the shots with a
 * Retina detail (app/data/details.ts) public/images/app/detail/
 * <name>-<theme>-<w>.<avif|webp> at both of its widths. Needs ImageMagick
 * (magick) with AVIF and WebP support.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { details, detailWidths } from "../app/data/details.ts";

const [mastersDir, ...only] = process.argv.slice(2);
if (!mastersDir || !existsSync(mastersDir)) {
  console.error("usage: npm run shots -- <masters-dir> [name...]");
  process.exit(1);
}

const OUT = new URL("../public/images/app/", import.meta.url).pathname;
const WIDTHS = [1280, 2400, 3600];
mkdirSync(join(OUT, "detail"), { recursive: true });

/* Text-heavy UI: lossless-looking WebP, and AVIF with 4:4:4 chroma so coloured text keeps its edges. */
const encode = (input, ops, out) => {
  execFileSync("magick", [input, ...ops, "-strip", "-quality", "86", "-define", "webp:method=6", `${out}.webp`]);
  execFileSync("magick", [input, ...ops, "-strip", "-quality", "68", "-define", "heic:chroma=444", "-define", "heic:speed=4", `${out}.avif`]);
};
const kb = (file) => `${Math.round(statSync(file).size / 1024)} kB`;

const masters = readdirSync(mastersDir).filter((f) => /^(.+)-(dark|light)\.png$/.test(f));
for (const file of masters) {
  const [, name, theme] = file.match(/^(.+)-(dark|light)\.png$/);
  if (only.length && !only.includes(name)) continue;
  const input = join(mastersDir, file);

  for (const w of WIDTHS) {
    const out = join(OUT, `${name}-${theme}-${w}`);
    encode(input, ["-filter", "Lanczos", "-resize", `${w}x`], out);
    console.log(`${name}-${theme}-${w}  avif ${kb(`${out}.avif`)}  webp ${kb(`${out}.webp`)}`);
  }

  const detail = details[name];
  if (!detail) continue;
  const [mw, mh] = execFileSync("magick", ["identify", "-format", "%w %h", input]).toString().split(" ").map(Number);
  const [x0, y0, x1, y1] = detail.box;
  const crop = `${Math.round((x1 - x0) * mw)}x${Math.round((y1 - y0) * mh)}+${Math.round(x0 * mw)}+${Math.round(y0 * mh)}`;
  for (const w of detailWidths(detail)) {
    const out = join(OUT, "detail", `${name}-${theme}-${w}`);
    encode(input, ["-crop", crop, "+repage", "-filter", "Lanczos", "-resize", `${w}x`], out);
    console.log(`detail/${name}-${theme}-${w}  avif ${kb(`${out}.avif`)}  webp ${kb(`${out}.webp`)}`);
  }
}
