<script setup lang="ts">
import { CLUSTERS_RELEASE_VERSION, REPO_URL } from "~/composables/useGitHub";

const { primary, platforms } = useDownloads();
const { stars } = useGitHub();
const clustersShipped = useReleaseAtLeast(CLUSTERS_RELEASE_VERSION);

/* This deploys once 2.0 is out, so 2.0 is the note unless the latest release says otherwise. */
const note = computed<{ tag: string; text: string; href: string }>(() =>
  clustersShipped.value === false
    ? { tag: "Coming soon", text: "JET Pilot 2.0: every cluster, every cloud", href: "#features" }
    : { tag: "2.0", text: "Every cluster, every cloud, in one calm hub", href: "#clusters" }
);

/* The hero shot is the LCP element: start fetching it with the HTML. Keep in step with the AppShot below. */
const sizes = "(min-width: 768px) min(96vw, 1280px), 250vw";
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      type: "image/avif",
      imagesrcset: [1280, 2400, 3600].map((w) => `/images/app/pods-dark-${w}.avif ${w}w`).join(", "),
      imagesizes: sizes,
      fetchpriority: "high",
    },
  ],
});

const linuxArm = computed(() => platforms.value.find((p) => p.os === "linux")?.hasArm);
</script>

<template>
  <section id="top" class="relative overflow-x-clip pt-28 sm:pt-32 lg:pt-36">
    <div class="container-x flex flex-col items-center text-center">
      <a :href="note.href" class="group inline-flex items-center gap-2.5 text-[0.85rem] text-muted transition-colors hover:text-fg">
        <span class="font-mono text-[0.75rem] font-medium text-accent-text">{{ note.tag }}</span>
        <span class="h-3 w-px bg-line-strong" aria-hidden="true" />
        <span>{{ note.text }}</span>
        <Icon name="arrowRight" :size="13" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>
      <h1 class="display mt-6 text-[3.4rem] sm:mt-8 sm:text-[6rem] lg:text-[7.25rem]">Kubernetes,<br />beautifully.</h1>
      <p class="mt-7 max-w-[36rem] text-balance text-[1.075rem] leading-relaxed text-muted sm:mt-9 sm:text-[1.2rem]">
        JET Pilot is a fast, native and open-source Kubernetes desktop client. Every cluster, from your kubeconfig or
        your cloud, in one calm app that updates live.
      </p>
      <div class="mt-9 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row">
        <a
          :href="primary.href"
          class="inline-flex h-12 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-fg px-6 text-[0.95rem] font-semibold text-bg transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Icon v-if="primary.os === 'macos'" name="apple" :size="17" />
          <Icon v-else-if="primary.os === 'windows'" name="windows" :size="16" />
          <Icon v-else name="download" :size="17" />
          <span>{{ primary.label }}</span>
        </a>
        <a
          :href="REPO_URL"
          class="inline-flex h-12 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-line-strong px-6 text-[0.95rem] font-semibold transition-colors hover:bg-fg/5 sm:w-auto"
        >
          <Icon name="github" :size="17" />
          GitHub
          <span v-if="stars !== null" class="flex items-center gap-1 text-sm font-medium tabular-nums text-muted">
            <Icon name="star" :size="13" />{{ stars }}
          </span>
        </a>
      </div>
      <p class="mt-6 text-[0.8rem] leading-relaxed text-faint">
        Free and MIT licensed<span v-if="primary.version"> · {{ primary.version }}</span> · macOS, Windows and Linux{{ linuxArm ? " (x64 and ARM64)" : "" }}
      </p>
      <p v-if="primary.os === 'macos'" class="mt-1 text-[0.8rem] text-faint">
        {{ primary.sub }} build<template v-if="primary.alt"> · <a :href="primary.alt.href" class="underline decoration-line-strong underline-offset-4 hover:text-fg">{{ primary.alt.label }}</a></template>
        · <a href="#macos-note" class="underline decoration-line-strong underline-offset-4 hover:text-fg">One extra step on first launch</a>
      </p>
    </div>

    <!-- the app, big and centred -->
    <div class="mx-auto mt-14 w-full max-w-[84rem] px-5 sm:mt-16 sm:px-8">
      <div class="hero-shot animate-rise">
        <div class="hero-frame">
          <div class="hero-img">
            <AppShot
              name="pods"
              priority
              alt="JET Pilot showing pods from two clusters, prod-eu-west-1 and staging-us-east-2, in one table with Context and Namespace columns, live CPU and memory sparklines and colour-coded statuses"
              :sizes="sizes"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-frame {
  position: relative;
  overflow: clip;
  border-radius: 14px;
  box-shadow:
    0 0 0 1px var(--line-strong),
    var(--shadow-float);
  /* Phones: a tall crop of the sidebar and the first columns, at a readable size. */
  height: 118vw;
}
.hero-img {
  width: 250vw;
}
/* The fold of the window fades into the page. */
.hero-frame::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 30%;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
}
@media (min-width: 768px) {
  .hero-frame {
    height: auto;
    border-radius: 18px;
  }
  .hero-img {
    width: 100%;
  }
  .hero-frame::after {
    height: 22%;
  }
}
</style>
