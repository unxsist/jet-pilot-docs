<script setup lang="ts">
import { faqJsonLd } from "~/utils/faqs";

const title = "JET Pilot — A beautiful, native Kubernetes desktop client";
const description =
  "Free, open-source Kubernetes desktop client for macOS, Windows and Linux. Live multi-cluster views, a resource graph, logs across pods, a YAML editor with dry run and a built-in kubectl terminal — native, fast and private.";

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
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "JET Pilot",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Windows, Linux",
        description,
        url: "https://www.jet-pilot.app",
        downloadUrl: "https://github.com/unxsist/jet-pilot/releases/latest",
        license: "https://opensource.org/licenses/MIT",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        image: "https://www.jet-pilot.app/images/og-image.png",
      }),
    },
    { type: "application/ld+json", innerHTML: faqJsonLd() },
  ],
});

useSeoMeta({
  title,
  description,
  ogType: "website",
  ogSiteName: "JET Pilot",
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://www.jet-pilot.app/images/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "JET Pilot — Kubernetes, beautifully. A screenshot of the app showing pods across two clusters.",
  ogUrl: "https://www.jet-pilot.app",
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-image.png",
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
    <HomePage />
  </div>
</template>
