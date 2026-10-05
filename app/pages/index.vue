<script setup lang="ts">
import { faqJsonLd } from "~/utils/faqs";

const title = "JET Pilot — A beautiful, native Kubernetes desktop client";
const description =
  "Free, open-source Kubernetes desktop client for macOS, Windows and Linux. Every cluster and cloud in one hub, live multi-cluster views, a resource graph, logs across pods, a YAML editor with dry run and a built-in kubectl terminal — native, fast and private.";

useHead({
  link: [{ rel: "canonical", href: "https://www.jet-pilot.app" }],
  script: [
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
  <HomePage />
</template>
