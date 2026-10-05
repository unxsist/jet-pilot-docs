<script setup lang="ts">
useHead({
  script: [
    {
      // Google Analytics (G-6L1LX1G558). Events queue in dataLayer right away;
      // gtag.js itself loads once the page is idle so it never delays rendering.
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6L1LX1G558');

        addEventListener('load', function () {
          (window.requestIdleCallback || setTimeout)(function () {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-6L1LX1G558';
            document.head.appendChild(s);
          });
        });
      `,
    },
  ],
});
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip">
    <a
      href="#main"
      class="sr-only z-[60] rounded-lg bg-fg px-3 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >Skip to content</a
    >
    <SiteNav />
    <NuxtPage />
  </div>
</template>
