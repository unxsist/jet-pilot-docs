<script setup lang="ts">
import { LIVE_RELEASE_VERSION, REPO_URL } from "~/composables/useGitHub";

const { primary, platforms } = useDownloads();
const { stars } = useGitHub();
const shipped = useNewReleaseShipped();
const { release } = useGitHub();
const liveShipped = useReleaseAtLeast(LIVE_RELEASE_VERSION);

const pill = computed(() => {
  // v1.37+: live data & the new graph. Before that (or while we don't know), the v1.36 pill.
  if (liveShipped.value) return { tag: "New in v1.37", text: "Live data, a reimagined resource graph & more", short: "Live data & a new resource graph" };
  if (shipped.value === false) return { tag: "Coming soon", text: "Multi-cluster, a built-in terminal & a whole new look" };
  if (shipped.value && release.value) return { tag: `New in v${release.value.version}`, text: "Multi-cluster, built-in terminal & a whole new look" };
  return { tag: "New", text: "Multi-cluster, built-in terminal & a whole new look" };
});

// The hero shot is the LCP element: start fetching it with the HTML.
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      type: "image/avif",
      imagesrcset: "/images/app/pods-dark-1280.avif 1280w, /images/app/pods-dark-2400.avif 2400w",
      imagesizes: "(min-width: 1280px) 1200px, (min-width: 640px) 94vw, 100vw",
      fetchpriority: "high",
    },
  ],
});

const linuxArm = computed(() => platforms.value.find((p) => p.os === "linux")?.hasArm);
</script>

<template>
  <section id="top" class="relative isolate overflow-hidden pt-28 sm:pt-36">
    <!-- backdrop -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="bg-grid absolute inset-0 opacity-70 dark:opacity-100" />
      <div
        class="absolute left-1/2 top-[-18rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-full opacity-60 dark:opacity-50"
        style="background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 38%, transparent), transparent)"
      />
    </div>

    <div class="container-x text-center">
      <a
        href="#whats-new"
        class="group inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-3 text-[0.8rem] text-muted shadow-card backdrop-blur transition-colors hover:border-line-strong hover:text-fg"
      >
        <span class="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[0.72rem] font-semibold text-white">{{ pill.tag }}</span>
        <span v-if="'short' in pill" class="truncate sm:hidden">{{ pill.short }}</span>
        <span class="truncate" :class="'short' in pill ? 'max-sm:hidden' : ''">{{ pill.text }}</span>
        <Icon name="arrowRight" :size="13" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>

      <h1
        class="mx-auto mt-7 max-w-4xl text-balance text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[5.5rem]"
        style="--delay: 60ms"
      >
        <span class="text-shine">Kubernetes,</span>{{ " " }}<span class="text-accent-shine pb-1">beautifully.</span>
      </h1>

      <p
        class="mx-auto mt-6 max-w-2xl text-[1.075rem] leading-relaxed text-muted sm:text-xl sm:leading-relaxed"
        style="--delay: 120ms"
      >
        JET Pilot is a fast, native and open-source Kubernetes desktop client. Every cluster and namespace in one calm
        interface, updating live — with a resource graph, logs across pods and a built-in terminal.
      </p>

      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style="--delay: 180ms">
        <a
          :href="primary.href"
          class="group relative inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-fg px-5 text-[0.95rem] font-semibold text-bg shadow-[0_8px_30px_-8px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-transform hover:-translate-y-px active:translate-y-0 sm:w-auto"
        >
          <Icon v-if="primary.os === 'macos'" name="apple" :size="17" />
          <Icon v-else-if="primary.os === 'windows'" name="windows" :size="16" />
          <Icon v-else name="download" :size="17" />
          <span>{{ primary.label }}</span>
          <span v-if="primary.version" class="rounded-md bg-bg/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-medium tabular-nums opacity-80">{{ primary.version }}</span>
        </a>
        <a
          :href="REPO_URL"
          class="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-surface/70 px-5 text-[0.95rem] font-semibold shadow-card backdrop-blur transition-colors hover:bg-surface-2 sm:w-auto"
        >
          <Icon name="github" :size="17" />
          Star on GitHub
          <span v-if="stars !== null" class="flex items-center gap-1 text-sm font-medium tabular-nums text-muted">
            <Icon name="star" :size="13" class="text-warning" />{{ stars }}
          </span>
        </a>
      </div>

      <div class="mt-5 space-y-1.5 text-[0.8rem] text-faint" style="--delay: 240ms">
        <p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Free &amp; open source</span><span aria-hidden="true">·</span><span>MIT</span><span aria-hidden="true">·</span>
          <span>macOS · Windows · Linux {{ linuxArm ? "(x64 & ARM64)" : "(x64)" }}</span>
        </p>
        <p v-if="primary.os === 'macos'" class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{{ primary.sub }} build</span>
          <template v-if="primary.alt">
            <span aria-hidden="true">·</span>
            <a :href="primary.alt.href" class="underline decoration-line-strong underline-offset-4 hover:text-fg">{{ primary.alt.label }}</a>
          </template>
          <span aria-hidden="true">·</span>
          <a href="#macos-note" class="underline decoration-line-strong underline-offset-4 hover:text-fg">One extra step on first launch</a>
        </p>
      </div>
    </div>

    <!-- product shot -->
    <div class="container-x relative mt-14 sm:mt-20">
      <div class="animate-rise relative mx-auto max-w-[75rem]">
        <div
          aria-hidden="true"
          class="absolute -inset-x-10 -top-10 bottom-1/3 -z-10 rounded-[3rem] opacity-70"
          style="background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 40%, transparent), transparent)"
        />
        <div
          class="rounded-[14px] p-px shadow-float sm:rounded-[18px]"
          style="background: linear-gradient(180deg, var(--line-strong), var(--line) 40%, transparent)"
        >
          <div class="overflow-hidden rounded-[13px] bg-surface ring-1 ring-black/5 sm:rounded-[17px] dark:ring-white/5">
            <div class="origin-top-left max-sm:scale-[1.65]">
            <AppShot
              name="pods"
              priority
              alt="JET Pilot showing pods from two clusters, prod-eu-west-1 and staging-us-east-2, in one table with Context and Namespace columns, live CPU and memory sparklines and colour-coded statuses"
              sizes="(min-width: 1280px) 1200px, (min-width: 640px) 94vw, 100vw"
            />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  </section>
</template>
