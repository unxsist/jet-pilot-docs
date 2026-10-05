<script setup lang="ts">
import { LIVE_RELEASE_VERSION, RELEASES_URL, REPO_URL, formatDate } from "~/composables/useGitHub";

const { release } = useGitHub();
// true: v1.37+ is out; false: the latest release is older; null: unknown (static HTML, API down).
const shipped = useReleaseAtLeast(LIVE_RELEASE_VERSION);

const highlights = [
  { icon: "zap", title: "Live data, much faster", text: "Lists stream changes from the Kubernetes API instead of polling kubectl. Updates land in a fraction of a second, and revisiting a view is instant." },
  { icon: "graph", title: "The resource graph, reimagined", text: "App lanes from Ingress to Pods, health roll-up, missing references, Problems mode, click-to-focus, search and a minimap." },
  { icon: "logs", title: "Logs across every pod", text: "Follow a Deployment, StatefulSet, DaemonSet, Job or Service — colour-coded per pod, with search, filters, previous containers and export." },
  { icon: "code", title: "A safer YAML editor", text: "Schema-aware completion from your cluster’s OpenAPI (CRDs too), a diff and server-side dry run before apply, and cross-context compare." },
  { icon: "refresh", title: "Rollouts, Helm & debugging", text: "Rollout history, diff and rollback. Helm upgrades with a values diff. Ephemeral debug containers, node shells and file copy." },
  { icon: "columns", title: "Workspaces & split view", text: "Save contexts, namespaces, tabs and port forwards as workspaces, put two tabs side by side, and get your tabs back on restart." },
  { icon: "keyboard", title: "k9s-style keyboard", text: "Move through rows with the arrows or j / k, act with l, s, e and d, and press ? for the cheat sheet." },
  { icon: "filter", title: "Much faster tables", text: "Reorder, resize and group columns, with CPU and memory sparklines per pod. Port-forward profiles start with the app." },
];
</script>

<template>
  <section id="whats-new" class="relative cv-auto py-20 sm:py-28" aria-labelledby="whats-new-title">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    <div class="container-x grid gap-12 lg:grid-cols-12">
      <div data-reveal class="lg:col-span-4">
        <span class="eyebrow">What's new in v1.37</span>
        <h2 id="whats-new-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
          Live, and much faster.
        </h2>
        <p class="mt-4 leading-relaxed text-muted">
          Watches instead of polling, a reimagined resource graph, logs across pods and workspaces — while keeping JET Pilot
          small, fast and private.
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
            The highlights on this list ship in <strong class="font-medium text-fg">v1.37</strong>, the next release. Watch the repository to be notified — and JET Pilot will offer the update automatically.
          </p>
          <p v-else-if="shipped" class="mt-3 text-[0.85rem] leading-relaxed text-muted">
            Everything on this list shipped in v1.37. Already installed? JET Pilot updates itself.
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

      <div class="lg:col-span-8">
        <ol class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
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
        <p data-reveal class="mt-5 flex gap-2.5 text-[0.85rem] leading-relaxed text-muted">
          <Icon name="sparkles" :size="15" class="mt-0.5 shrink-0 text-accent-text" />
          <span>
            <strong class="font-medium text-fg">Landed in v1.36:</strong> multi-cluster and multi-namespace views, a built-in
            kubectl terminal, a complete redesign and Linux ARM64 builds.
          </span>
        </p>
      </div>
    </div>
  </section>
</template>
