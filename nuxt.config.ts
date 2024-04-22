// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/device",
    "@nuxt/image",
    "@nuxtjs/seo",
  ],
  site: {
    url: "https://www.jet-pilot.app",
    name: "JET Pilot - Manage Kubernetes in style",
    description:
      "JET Pilot is an open-source Kubernetes desktop client that focuses on less clutter, speed and good looks.",
    defaultLocale: "en",
  },
  ogImage: {
    enabled: false,
  },
  googleFonts: {
    families: {
      Inter: "100..900",
    },
  },
  colorMode: {
    classSuffix: "",
  },
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
});
