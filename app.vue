<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "en",
  },
  title: "JET Pilot - Manage Kubernetes in style",
  meta: [
    {
      name: "description",
      content:
        "JET Pilot is an open-source Kubernetes desktop client that focuses on less clutter, speed and good looks.",
    },
    {
      name: "keywords",
      content: "kubernetes, desktop, client, open-source, jet pilot",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
  script: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-6L1LX1G558",
      async: true,
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6L1LX1G558');
      `,
    },
  ],
});
</script>

<template>
  <div class="container mx-auto">
    <Header />
    <NuxtPage />
  </div>
</template>

<style lang="postcss">
body {
  @apply font-sans antialiased bg-white text-black dark:bg-black dark:text-white;
}
</style>
