<script setup lang="ts">
import { REPO_URL } from "~/composables/useGitHub";

const { stars } = useGitHub();
const { onHome, href } = useSiteHref();
const route = useRoute();
const scrolled = ref(false);
const open = ref(false);

const links = computed(() => [
  { href: href("#features"), label: "Features" },
  { href: "/themes/", label: "Themes", current: route.path.startsWith("/themes") },
  { href: href("#download"), label: "Download" },
  { href: href("#faq"), label: "FAQ" },
]);

onMounted(() => {
  const onScroll = () => (scrolled.value = window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
});

const starLabel = computed(() =>
  stars.value === null ? null : stars.value >= 1000 ? `${(stars.value / 1000).toFixed(1)}k` : String(stars.value)
);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="
      scrolled || open
        ? 'border-b border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150'
        : 'border-b border-transparent'
    "
  >
    <nav class="container-x flex h-16 items-center gap-6" aria-label="Main">
      <a :href="onHome ? '#top' : '/'" class="group flex items-center gap-2.5 rounded-lg" aria-label="JET Pilot home">
        <img src="/images/icon-64.webp" alt="" width="28" height="28" class="size-7 rounded-[7px]" />
        <span class="text-[0.95rem] font-semibold tracking-tight">JET Pilot</span>
      </a>

      <ul class="ml-4 hidden items-center gap-1 md:flex">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            :aria-current="link.current ? 'page' : undefined"
            class="rounded-full px-3 py-1.5 text-sm transition-colors hover:text-fg"
            :class="link.current ? 'text-fg' : 'text-muted'"
            >{{ link.label }}</a
          >
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-1.5">
        <a
          :href="REPO_URL"
          class="hidden h-8 items-center gap-2 rounded-full border border-line bg-surface/60 pl-2.5 pr-3 text-[0.8rem] font-medium text-muted shadow-card transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
        >
          <Icon name="github" :size="15" />
          <span>Star<span class="sr-only"> JET Pilot on GitHub</span></span>
          <span v-if="starLabel" class="flex items-center gap-1 border-l border-line pl-2 tabular-nums text-fg">
            <Icon name="star" :size="12" class="text-warning" />{{ starLabel }}<span class="sr-only"> stars</span>
          </span>
        </a>
        <ThemeToggle />
        <a
          :href="href('#download')"
          class="ml-1 hidden h-8 items-center gap-1.5 rounded-full bg-fg px-3.5 text-[0.8rem] font-semibold text-bg transition-opacity hover:opacity-90 sm:inline-flex"
        >
          Download
        </a>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-full text-muted hover:text-fg md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <Icon :name="open ? 'x' : 'menu'" :size="18" />
        </button>
      </div>
    </nav>

    <div v-show="open" id="mobile-menu" class="container-x pb-4 md:hidden">
      <ul class="grid gap-1 border-t border-line pt-3">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" :aria-current="link.current ? 'page' : undefined" class="block rounded-lg px-3 py-2.5 text-[0.95rem] hover:bg-fg/5 hover:text-fg" :class="link.current ? 'text-fg' : 'text-muted'" @click="open = false">{{ link.label }}</a>
        </li>
        <li>
          <a :href="REPO_URL" class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[0.95rem] text-muted hover:bg-fg/5 hover:text-fg">
            <Icon name="github" :size="16" /> GitHub
            <span v-if="starLabel" class="ml-auto flex items-center gap-1 text-sm tabular-nums"><Icon name="star" :size="12" class="text-warning" />{{ starLabel }}</span>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
