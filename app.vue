<script setup lang="ts">
useHead({
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

useSeoMeta({
  ogTitle: "JET Pilot - Manage Kubernetes in style",
  ogDescription:
    "JET Pilot is an open-source Kubernetes desktop client that focuses on less clutter, speed and good looks.",
  ogImage: "/images/og-image.png",
  ogUrl: "https://www.jet-pilot.app",
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
