<script setup lang="ts">
import changelog from "~/data/changelog.json";
import { REPO_URL } from "~/composables/useGitHub";

/*
 * app/data/changelog.json is generated from the app's CHANGELOG.md by
 * scripts/sync-changelog.mjs (on every deploy); its HTML comes from our own
 * markdown, never from visitors.
 */

const PAGE_URL = "https://www.jet-pilot.app/changelog/";
const title = "Changelog — JET Pilot";
const description =
  "What changed in each JET Pilot release, newest first: new features, improvements and fixes in the free, open-source Kubernetes desktop client.";

useHead({ link: [{ rel: "canonical", href: PAGE_URL }] });
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
  ogUrl: PAGE_URL,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-image.png",
});

const releases = changelog.releases;
const oldest = releases.at(-1)?.version;

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const formatDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));
</script>

<template>
  <main id="main">
    <header class="container-x pb-14 pt-36 sm:pb-20 sm:pt-44">
      <h1 class="display text-[3.4rem] sm:text-[5.5rem] lg:text-[6.25rem]">Changelog</h1>
      <p class="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-muted sm:text-[1.15rem]">
        What changed in each release, newest first. JET Pilot updates itself, so you’re always on the latest.
      </p>
    </header>

    <div class="border-b border-line">
      <article
        v-for="(release, i) in releases"
        :id="`v${release.version}`"
        :key="release.version"
        class="release border-t border-line"
        :class="release.kind === 'patch' ? 'py-10 sm:py-12' : 'py-14 sm:py-20'"
        :aria-labelledby="`v${release.version}-title`"
      >
        <div class="container-x grid gap-x-10 gap-y-5 lg:grid-cols-12">
          <div class="lg:col-span-3">
            <div class="flex items-baseline gap-3 lg:sticky lg:top-24 lg:block">
              <a
                :href="`#v${release.version}`"
                class="version font-semibold tabular-nums tracking-[-0.03em] transition-colors hover:text-muted"
                :class="release.kind === 'patch' ? 'text-[1.15rem]' : 'text-[1.6rem] sm:text-[1.9rem]'"
                >{{ release.version }}</a
              >
              <p class="text-[0.85rem] text-faint lg:mt-1.5">
                <time :datetime="release.date">{{ formatDate(release.date) }}</time>
              </p>
              <span
                v-if="i === 0"
                class="inline-flex items-center rounded-full bg-accent-soft px-2 py-0.5 text-[0.72rem] font-medium text-accent-text lg:mt-3"
                >Latest</span
              >
            </div>
          </div>

          <div class="min-w-0 lg:col-span-9">
            <h2
              v-if="release.title"
              :id="`v${release.version}-title`"
              class="max-w-3xl text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[2.6rem]"
              v-html="release.title"
            />
            <h2 v-else :id="`v${release.version}-title`" class="sr-only">JET Pilot {{ release.version }}</h2>
            <p
              v-for="text in release.intro"
              :key="text"
              class="prose-inline mt-4 max-w-2xl text-pretty text-[1.06rem] leading-relaxed text-muted"
              v-html="text"
            />

            <section
              v-for="(group, g) in release.groups"
              :key="group.name"
              :class="release.title ? (g === 0 ? 'mt-10' : 'mt-9') : g === 0 ? '' : 'mt-8'"
            >
              <h3 class="text-[0.85rem] font-medium text-faint">{{ group.name }}</h3>
              <ul class="mt-3.5 max-w-3xl space-y-3">
                <li
                  v-for="item in group.items"
                  :key="item"
                  class="item prose-inline relative pl-5 text-[0.98rem] leading-relaxed text-muted"
                  v-html="item"
                />
              </ul>
            </section>
          </div>
        </div>
      </article>
    </div>

    <p class="container-x py-12 text-[0.9rem] text-faint">
      This changelog starts at {{ oldest }}, the release that rebuilt JET Pilot. Earlier releases are on
      <a :href="`${REPO_URL}/releases`" class="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-fg">GitHub</a>.
    </p>

    <LazySiteFooter hydrate-on-visible />
  </main>
</template>

<style scoped>
.release {
  scroll-margin-top: 4rem;
}

.item::before {
  content: "";
  position: absolute;
  left: 0.25rem;
  top: 0.72em;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 999px;
  background: var(--line-strong);
}

.prose-inline :deep(strong) {
  font-weight: 550;
  color: var(--fg);
}
.prose-inline :deep(code) {
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.1rem 0.35rem;
  font-size: 0.84em;
  color: var(--fg);
  word-break: break-word;
}
.prose-inline :deep(kbd) {
  display: inline-block;
  min-width: 1.5em;
  border: 1px solid var(--line-strong);
  border-bottom-width: 2px;
  border-radius: 0.375rem;
  background: var(--surface-2);
  padding: 0 0.35rem;
  font-size: 0.8em;
  line-height: 1.55;
  text-align: center;
  color: var(--fg);
}
.prose-inline :deep(a) {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 4px;
}
.prose-inline :deep(a:hover) {
  text-decoration-color: var(--fg);
}
</style>
