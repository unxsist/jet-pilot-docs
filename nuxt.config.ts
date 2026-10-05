import tailwindcss from "@tailwindcss/vite";

const title = "JET Pilot — A beautiful, native Kubernetes desktop client";
const description =
  "JET Pilot is a free, open-source Kubernetes desktop client for macOS, Windows and Linux. Every cluster and cloud in one hub, live multi-cluster views, a resource graph, logs across pods, a YAML editor with dry run and a built-in kubectl terminal — native, fast and private.";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: false },
  modules: ["@nuxtjs/color-mode", "@nuxtjs/sitemap", "@nuxtjs/robots"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  site: {
    url: "https://www.jet-pilot.app",
    name: "JET Pilot",
    description,
    defaultLocale: "en",
    // GitHub Pages serves /themes/index.html at /themes/ (and redirects /themes there).
    trailingSlash: true,
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    storageKey: "jet-pilot-color-mode",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title,
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "description", content: description },
        { name: "theme-color", content: "#09090b", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        {
          rel: "preload",
          href: "/fonts/inter-var.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
        { rel: "preconnect", href: "https://api.github.com", crossorigin: "" },
      ],
    },
  },
  hooks: {
    // The theme engine for "Try your own theme" (app/lib/customTheme.ts and the
    // vendored engine) loads only when a visitor imports a theme: no prefetch.
    "build:manifest"(manifest) {
      for (const [key, chunk] of Object.entries(manifest)) {
        if (/(^|\/)lib\/customTheme\.ts$|(^|\/)vendor\/jet-themes\/|node_modules\/(culori|jsonc-parser|fast-plist)\//.test(key)) {
          chunk.prefetch = false;
          chunk.preload = false;
        }
      }
    },
  },
  nitro: {
    prerender: {
      failOnError: false,
      crawlLinks: true,
      routes: ["/", "/themes/", "/sitemap.xml", "/robots.txt", "/latest.json"],
    },
  },
});
