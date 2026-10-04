<script setup lang="ts">
import { REPO_URL } from "~/composables/useGitHub";

const { stars, contributors } = useGitHub();

const links = [
  { icon: "star", title: "Star the repo", text: "It genuinely helps others find JET Pilot.", href: REPO_URL },
  { icon: "bug", title: "Report an issue", text: "Found a bug or missing a resource? Tell us.", href: `${REPO_URL}/issues/new/choose` },
  { icon: "gitPr", title: "Contribute", text: "Rust + Tauri 2 on the backend, Vue 3 + TypeScript in front.", href: `${REPO_URL}/pulls` },
];
</script>

<template>
  <section id="open-source" class="relative cv-auto py-20 sm:py-28" aria-labelledby="oss-title">
    <div class="container-x">
      <div class="card noise overflow-hidden p-8 sm:p-12">
        <div aria-hidden="true" class="bg-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_80%_at_100%_0%,#000,transparent)]" />
        <div class="relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div data-reveal>
            <span class="eyebrow">Open source</span>
            <h2 id="oss-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
              Built in the open, since December 2023.
            </h2>
            <p class="mt-4 max-w-lg leading-relaxed text-muted">
              JET Pilot is MIT licensed and developed on GitHub. No paid tier, no feature gates, no account wall —
              just a tool made by people who use Kubernetes every day.
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-6">
              <div v-if="stars !== null">
                <p class="flex items-center gap-2 text-3xl font-semibold tracking-tight tabular-nums">
                  <Icon name="star" :size="22" class="text-warning" />
                  <span>{{ stars }}</span>
                </p>
                <p class="mt-1 text-[0.8rem] text-faint">GitHub stars</p>
              </div>
              <a
                v-else
                :href="REPO_URL"
                class="inline-flex h-11 items-center gap-2.5 rounded-xl border border-line-strong bg-bg/60 px-4 text-[0.9rem] font-semibold transition-colors hover:bg-surface-2"
              >
                <Icon name="star" :size="16" class="text-warning" /> Star on GitHub
              </a>
              <div v-if="contributors && contributors.length" class="sm:border-l sm:border-line sm:pl-6">
                <ul class="flex -space-x-2" aria-label="Contributors">
                  <li v-for="person in contributors.slice(0, 12)" :key="person.login">
                    <a :href="person.url" :title="person.login" class="block rounded-full ring-2 ring-surface transition-transform hover:-translate-y-0.5">
                      <img :src="`${person.avatar}&s=72`" :alt="person.login" width="36" height="36" loading="lazy" class="size-9 rounded-full bg-surface-2" />
                    </a>
                  </li>
                </ul>
                <p class="mt-2 text-[0.8rem] text-faint">{{ contributors.length }} contributor{{ contributors.length === 1 ? "" : "s" }} — you could be next</p>
              </div>
            </div>
          </div>

          <ul class="grid gap-3">
            <li v-for="(link, i) in links" :key="link.title" data-reveal :style="{ '--reveal-delay': `${i * 80}ms` }">
              <a :href="link.href" class="group flex items-center gap-4 rounded-xl border border-line bg-bg/60 p-4 backdrop-blur transition-colors hover:border-line-strong hover:bg-surface-2">
                <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent-text"><Icon :name="link.icon" :size="17" /></span>
                <span class="min-w-0">
                  <span class="block font-medium">{{ link.title }}</span>
                  <span class="block text-[0.85rem] text-muted">{{ link.text }}</span>
                </span>
                <Icon name="arrowUpRight" :size="16" class="ml-auto shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
