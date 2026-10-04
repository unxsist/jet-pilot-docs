<script setup lang="ts">
import { RELEASES_URL, REPO_URL, formatDate } from "~/composables/useGitHub";

const { release } = useGitHub();
const shipped = useNewReleaseShipped();

const highlights = [
  { icon: "layers", title: "Multi-cluster & multi-namespace", text: "Select several contexts across multiple kubeconfig files and any mix of namespaces. Tables merge it all, with Context and Namespace columns." },
  { icon: "palette", title: "A completely redesigned UI", text: "A new design system with Inter and JetBrains Mono, polished dark and light themes, and a careful pass over every screen." },
  { icon: "terminal", title: "Built-in kubectl terminal", text: "Ctrl+` opens a terminal wired to the current context through a temporary kubeconfig. Pod shells now work on Windows too." },
  { icon: "box", title: "Linux ARM64 builds", text: "Native aarch64 packages for Linux join the x64 builds." },
  { icon: "plug", title: "Reliable port forwarding", text: "Readiness detection that knows when a forward is actually usable." },
  { icon: "filter", title: "Better tables", text: "Type-to-filter everywhere, stable selection, clear loading, error and empty states, and safer bulk actions." },
  { icon: "shield", title: "Security hardening", text: "Strict CSP, minimal permissions, per-kubeconfig clients and no secrets written to disk while editing." },
  { icon: "sparkles", title: "Dozens of fixes", text: "Tab lifecycle, resource graph, editor, accessibility, init-container logs and shells, AWS SSO detection and more." },
];
</script>

<template>
  <section id="whats-new" class="relative cv-auto py-20 sm:py-28" aria-labelledby="whats-new-title">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    <div class="container-x grid gap-12 lg:grid-cols-12">
      <div data-reveal class="lg:col-span-4">
        <span class="eyebrow">What's new</span>
        <h2 id="whats-new-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
          The biggest update yet.
        </h2>
        <p class="mt-4 leading-relaxed text-muted">
          Multi-cluster support, a built-in terminal and a ground-up redesign — while keeping JET Pilot small, fast and private.
        </p>

        <div class="card mt-8 p-5">
          <div class="flex items-center gap-2 text-[0.8rem] text-faint">
            <span class="relative flex size-2"><span class="absolute inset-0 rounded-full bg-success/60 motion-safe:animate-[pulse-dot_2s_ease-in-out_infinite]" /><span class="relative size-2 rounded-full bg-success" /></span>
            Latest release
          </div>
          <p class="mt-2 flex items-baseline gap-2">
            <span class="font-mono text-2xl font-semibold tracking-tight">{{ release ? release.tag : "—" }}</span>
            <span v-if="release" class="text-sm text-muted">{{ formatDate(release.publishedAt) }}</span>
          </p>
          <p v-if="shipped === false" class="mt-3 text-[0.85rem] leading-relaxed text-muted">
            The highlights on this page ship in the <strong class="font-medium text-fg">next release</strong>. Watch the repository to be notified — and JET Pilot will offer the update automatically.
          </p>
          <p v-else-if="shipped" class="mt-3 text-[0.85rem] leading-relaxed text-muted">
            Everything on this list is in this release. Already installed? JET Pilot updates itself.
          </p>
          <p v-else class="mt-3 text-[0.85rem] leading-relaxed text-muted">
            JET Pilot checks for updates and installs them for you.
          </p>
          <div class="mt-4 flex flex-wrap gap-2 text-[0.8rem]">
            <a :href="release?.url ?? RELEASES_URL" class="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 font-medium hover:bg-fg/5">
              Release notes <Icon name="arrowUpRight" :size="13" />
            </a>
            <a :href="`${REPO_URL}/releases`" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-muted hover:text-fg">All releases</a>
          </div>
        </div>
      </div>

      <ol class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-8">
        <li
          v-for="(item, i) in highlights"
          :key="item.title"
          data-reveal
          :style="{ '--reveal-delay': `${(i % 2) * 80}ms` }"
          class="group bg-bg p-6 transition-colors hover:bg-surface"
        >
          <span class="inline-flex size-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent-text">
            <Icon :name="item.icon" :size="15" />
          </span>
          <h3 class="mt-4 font-semibold tracking-tight">{{ item.title }}</h3>
          <p class="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{{ item.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
