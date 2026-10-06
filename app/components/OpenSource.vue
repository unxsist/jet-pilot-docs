<script setup lang="ts">
import { REPO_URL } from "~/composables/useGitHub";

const { stars, contributors } = useGitHub();

const links = [
  { title: "Star the repo", text: "It genuinely helps others find JET Pilot.", href: REPO_URL },
  { title: "Report an issue", text: "Found a bug or missing a resource? Tell us.", href: `${REPO_URL}/issues/new/choose` },
  { title: "Contribute", text: "Rust and Tauri 2 on the backend, Vue 3 and TypeScript in front.", href: `${REPO_URL}/pulls` },
];
</script>

<template>
  <section id="open-source" class="relative cv-auto border-t border-line py-24 sm:py-32" aria-labelledby="oss-title">
    <div class="container-x grid gap-x-10 gap-y-12 lg:grid-cols-12">
      <div class="lg:col-span-6">
        <h2 id="oss-title" class="display text-[2.6rem] sm:text-[4rem] lg:text-[4.25rem]">Built in the open.</h2>
        <p class="mt-5 max-w-md text-[1.06rem] leading-relaxed text-muted">
          MIT licensed and developed on GitHub since December 2023. No paid tier, no feature gates, no account wall: a
          tool made by people who use Kubernetes every day.
        </p>
        <div class="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
          <a v-if="stars !== null" :href="REPO_URL" class="group block">
            <span class="display block text-[3.5rem] tabular-nums sm:text-[4.5rem]">{{ stars }}</span>
            <span class="mt-1 flex items-center gap-1.5 text-[0.8rem] text-faint group-hover:text-fg"><Icon name="star" :size="13" /> GitHub stars</span>
          </a>
          <div v-if="contributors && contributors.length">
            <ul class="flex -space-x-2" aria-label="Contributors">
              <li v-for="person in contributors.slice(0, 12)" :key="person.login">
                <a :href="person.url" :title="person.login" class="block rounded-full ring-2 ring-bg transition-transform hover:-translate-y-0.5">
                  <img :src="`${person.avatar}&s=72`" :alt="person.login" width="36" height="36" loading="lazy" class="size-9 rounded-full bg-surface-2" />
                </a>
              </li>
            </ul>
            <p class="mt-2 text-[0.8rem] text-faint">{{ contributors.length }} contributor{{ contributors.length === 1 ? "" : "s" }}, and room for you</p>
          </div>
        </div>
      </div>

      <ul class="lg:col-span-5 lg:col-start-8 lg:self-end">
        <li v-for="link in links" :key="link.title">
          <a :href="link.href" class="oss-link group">
            <span class="min-w-0">
              <span class="block text-[1.05rem] font-medium tracking-tight">{{ link.title }}</span>
              <span class="mt-0.5 block text-[0.875rem] text-muted">{{ link.text }}</span>
            </span>
            <Icon name="arrowUpRight" :size="18" class="ml-auto shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.oss-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--line);
  padding-block: 1.15rem;
}
li:first-child > .oss-link {
  border-top: 1px solid var(--line);
}
</style>
