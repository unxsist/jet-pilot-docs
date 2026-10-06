<script setup lang="ts">
import { REPO_URL, RELEASES_URL } from "~/composables/useGitHub";

const { primary } = useDownloads();
const { onHome, href } = useSiteHref();

const columns = computed(() => [
  {
    title: "Product",
    links: [
      { label: "Features", href: href("#features") },
      { label: "Themes", href: "/themes/" },
      { label: "Download", href: href("#download") },
      { label: "FAQ", href: href("#faq") },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: REPO_URL },
      { label: "Releases", href: RELEASES_URL },
      { label: "Issues", href: `${REPO_URL}/issues` },
      { label: "MIT licence", href: `${REPO_URL}/blob/main/LICENSE` },
    ],
  },
]);
</script>

<template>
  <footer class="relative cv-auto overflow-hidden border-t border-line">
    <!-- closing CTA -->
    <div class="container-x grid gap-x-10 gap-y-8 py-24 sm:py-32 lg:grid-cols-12 lg:items-end">
      <div class="lg:col-span-8">
        <img src="/images/icon-256.webp" alt="" width="96" height="96" loading="lazy" class="size-16 sm:size-20" />
        <h2 class="display mt-8 text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem]">Your clusters<br />deserve better.</h2>
      </div>
      <div class="lg:col-span-4 lg:pb-3">
        <p class="text-[1.06rem] text-muted">Free, open source and yours in a few clicks.</p>
        <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a :href="primary.href" class="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-fg px-5 text-[0.95rem] font-semibold text-bg transition-opacity hover:opacity-90">
            <Icon name="download" :size="17" /> {{ primary.label }}
          </a>
          <a :href="REPO_URL" class="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-line-strong px-5 text-[0.95rem] font-semibold transition-colors hover:bg-fg/5">
            <Icon name="github" :size="17" /> GitHub
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-line">
      <div class="container-x flex flex-col gap-10 py-12 sm:flex-row sm:justify-between">
        <div class="max-w-xs">
          <a :href="onHome ? '#top' : '/'" class="flex items-center gap-2.5">
            <img src="/images/icon-64.webp" alt="" width="28" height="28" loading="lazy" class="size-7 rounded-[7px]" />
            <span class="font-semibold tracking-tight">JET Pilot</span>
          </a>
          <p class="mt-3 text-[0.85rem] leading-relaxed text-faint">
            A beautiful, native Kubernetes desktop client for macOS, Windows and Linux.
          </p>
        </div>
        <nav class="grid grid-cols-2 gap-10 sm:gap-16" aria-label="Footer">
          <div v-for="col in columns" :key="col.title">
            <h3 class="text-[0.8rem] font-medium text-fg">{{ col.title }}</h3>
            <ul class="mt-3 space-y-2">
              <li v-for="link in col.links" :key="link.label">
                <a :href="link.href" class="text-[0.85rem] text-faint transition-colors hover:text-fg">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="container-x flex flex-col gap-2 border-t border-line py-6 text-[0.78rem] text-faint sm:flex-row sm:justify-between">
        <p>© {{ new Date().getFullYear() }} JET Pilot contributors · MIT licensed</p>
        <p>Kubernetes is a registered trademark of The Linux Foundation. JET Pilot is not affiliated with it.</p>
      </div>
    </div>
  </footer>
</template>
