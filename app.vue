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
      textContent: `
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
