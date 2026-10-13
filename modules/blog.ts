/*
 * The blog: Markdown posts in content/blog/*.md, rendered to HTML once, at
 * build time. Nothing here ships to the browser: markdown-it and Shiki run in
 * Node while Nuxt starts, and the server routes in server/ hand the finished
 * HTML to the pages (and the static payloads) during prerendering.
 *
 * A post is a file with a small frontmatter block:
 *
 *   ---
 *   title: "Rebuilding a Kubernetes desktop client"
 *   description: "One or two sentences, at most 155 characters."
 *   date: 2026-10-14
 *   draft: true
 *   ---
 *
 * The file name is the URL: content/blog/my-post.md is /blog/my-post/.
 * Drafts are rendered at their URL so they can be read before publishing,
 * but get a noindex robots tag and stay out of /blog/, the sitemap and the
 * RSS feed. While no post is published, /blog/ itself is noindex too.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  draft: boolean;
  readingMinutes: number;
  html: string;
}

export type BlogPostMeta = Omit<BlogPost, "html">;

/* Frontmatter: flat `key: value` lines; strings may be quoted, true/false are booleans. */
function parseFrontmatter(source: string, file: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`[blog] ${file}: missing frontmatter`);
  const data: Record<string, string | boolean> = {};
  for (const line of match[1]!.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) throw new Error(`[blog] ${file}: can't read frontmatter line "${line}"`);
    let value: string | boolean = kv[2]!.trim();
    if (value === "true" || value === "false") value = value === "true";
    else if (/^".*"$/.test(value)) value = JSON.parse(value);
    else if (/^'.*'$/.test(value)) value = value.slice(1, -1).replace(/''/g, "'");
    data[kv[1]!] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/^\d+\.\s+/, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

const LANG_ALIASES: Record<string, string> = { ts: "typescript", sh: "bash", shell: "bash", yml: "yaml", rs: "rust" };

async function createRenderer() {
  const highlighter = await createHighlighterCore({
    themes: [import("shiki/themes/github-light.mjs"), import("shiki/themes/github-dark.mjs")],
    langs: [
      import("shiki/langs/rust.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/yaml.mjs"),
      import("shiki/langs/toml.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/vue.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  const known = new Set(highlighter.getLoadedLanguages());

  const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, info) {
      const lang = LANG_ALIASES[info] ?? info;
      if (!known.has(lang)) return "";
      // Both themes as CSS variables; main.css-level styles pick one per colour mode.
      return highlighter.codeToHtml(code, {
        lang,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      });
    },
  });
  md.use(anchor, {
    slugify,
    level: [2, 3],
    tabIndex: false,
    permalink: anchor.permalink.headerLink({ class: "heading-link" }),
  });
  return md;
}

/* About 230 words a minute for prose; code blocks are skimmed, so they count for a third. */
function readingMinutes(body: string) {
  const code = body.match(/```[\s\S]*?```/g) ?? [];
  const prose = body.replace(/```[\s\S]*?```/g, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const total = words(prose) + code.reduce((n, block) => n + words(block), 0) / 3;
  return Math.max(1, Math.round(total / 230));
}

export async function loadPosts(dir: string): Promise<BlogPost[]> {
  if (!existsSync(dir)) return [];
  const md = await createRenderer();
  const posts = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(join(dir, file), "utf8"), file);
      const slug = file.replace(/\.md$/, "");
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`[blog] ${file}: use lowercase-and-dashes file names`);
      for (const key of ["title", "description", "date"]) {
        if (typeof data[key] !== "string" || !data[key]) throw new Error(`[blog] ${file}: frontmatter needs a "${key}"`);
      }
      const date = String(data.date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`[blog] ${file}: date must look like 2026-10-14`);
      const description = String(data.description);
      if (description.length > 155) console.warn(`[blog] ${file}: description is ${description.length} characters; search engines cut it at about 155`);
      // HTML comments (notes, image placeholders) stay in the Markdown only.
      const html = md.render(body).replace(/<!--[\s\S]*?-->\n?/g, "");
      return {
        slug,
        title: String(data.title),
        description,
        date,
        draft: data.draft === true,
        readingMinutes: readingMinutes(body),
        html,
      };
    });
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export default defineNuxtModule({
  meta: { name: "blog" },
  async setup(_options, nuxt) {
    const dir = join(nuxt.options.rootDir, "content/blog");
    const posts = await loadPosts(dir);
    const published = posts.filter((p) => !p.draft);

    // Edit a post in `npm run dev` and the dev server restarts with it.
    nuxt.options.watch.push(/content[\\/]blog[\\/]/);

    nuxt.hook("nitro:config", (config) => {
      config.virtual ??= {};
      config.virtual["#blog-posts"] = () => `export default ${JSON.stringify(posts)};`;

      // The homepage preview build (SITE_PREVIEW=1) prerenders only "/".
      if (process.env.SITE_PREVIEW === "1") return;
      config.prerender ??= {};
      config.prerender.routes = [
        ...(config.prerender.routes ?? []),
        "/blog/",
        "/blog/rss.xml",
        ...posts.map((p) => `/blog/${p.slug}/`),
      ];
    });

    // Drafts, and an index with nothing published yet, are noindex and out of the sitemap.
    const hidden = [...posts.filter((p) => p.draft).map((p) => `/blog/${p.slug}/`), ...(published.length ? [] : ["/blog/"])];
    for (const route of hidden) {
      nuxt.options.routeRules ??= {};
      nuxt.options.routeRules[route] = { ...nuxt.options.routeRules[route], robots: false, sitemap: false } as never;
    }
  },
});
