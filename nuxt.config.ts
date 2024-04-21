// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/device",
  ],
  googleFonts: {
    families: {
      Inter: "100..900",
    },
  },
  colorMode: {
    classSuffix: "",
  },
});
