<script setup lang="ts">
import { RELEASES_URL, REPO_URL, THEMES_RELEASE_VERSION, formatDate } from "~/composables/useGitHub";

const { release } = useGitHub();
// true: v1.38+ is out; false: the latest release is older; null: unknown (static HTML, API down).
const shipped = useReleaseAtLeast(THEMES_RELEASE_VERSION);

const highlights = [
  { icon: "palette", title: "Custom themes", text: "A T3 Code–compatible theme file with light and dark variants. Two colours are enough — the rest is derived, with contrast guarantees.", href: "/themes/" },
  { icon: "code", title: "Bring your VS Code theme", text: "Import VS Code, Sublime Text, TextMate and T3 Code themes. Editor syntax and terminal colours come along.", href: "/themes/#try" },
  { icon: "search", title: "Open VSX gallery", text: "Search and install VS Code themes from open-vsx.org without leaving the app. MIT-licensed themes only, so JET Pilot stays MIT." },
  { icon: "feather", title: "A JSON theme editor", text: "Schema completion, hovers and validation, with a live preview on the whole app while you type." },
  { icon: "command", title: "Change theme…", text: "⌘⌥A / Ctrl+Alt+A in the command palette previews themes as you arrow through; Esc puts yours back." },
  { icon: "layers", title: "13 more built-ins", text: "Catppuccin, Tokyo Night, Dracula, Nord, GitHub, One Dark Pro, Rosé Pine, Gruvbox and T3 Code’s five palettes." },
  { icon: "refresh", title: "A watched themes folder", text: "Drop .json themes into the themes folder and edit them in any editor — JET Pilot updates as you save." },
  { icon: "apple", title: "Our own Homebrew tap", text: "On macOS: brew install --cask unxsist/tap/jet-pilot. Homebrew handles the first-launch quarantine step." },
];
</script>

<template>
  <section id="whats-new" class="relative cv-auto py-20 sm:py-28" aria-labelledby="whats-new-title">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    <div class="container-x grid gap-12 lg:grid-cols-12">
      <div data-reveal class="lg:col-span-4">
        <span class="eyebrow">What's new in v1.38</span>
        <h2 id="whats-new-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
          Make it yours.
        </h2>
        <p class="mt-4 leading-relaxed text-muted">
          Custom themes that speak T3 Code, VS Code, Sublime Text and TextMate — with a gallery, a JSON editor and a
          theme switcher in the command palette.
        </p>
        <a href="/themes/" class="group mt-5 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-accent-text">
          Preview the themes <Icon name="arrowRight" :size="14" class="transition-transform group-hover:translate-x-0.5" />
        </a>

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
            The highlights on this list ship in <strong class="font-medium text-fg">v1.38</strong>, the next release. Watch the repository to be notified — and JET Pilot will offer the update automatically.
          </p>
          <p v-else-if="shipped" class="mt-3 text-[0.85rem] leading-relaxed text-muted">
            Everything on this list shipped in v1.38. Already installed? JET Pilot updates itself.
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
            <h3 class="mt-4 font-semibold tracking-tight">
              <a v-if="item.href" :href="item.href" class="hover:text-accent-text">{{ item.title }}</a>
              <template v-else>{{ item.title }}</template>
            </h3>
            <p class="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{{ item.text }}</p>
          </li>
        </ol>
        <div data-reveal class="mt-5 space-y-2.5 text-[0.85rem] leading-relaxed text-muted">
          <p class="flex gap-2.5">
            <Icon name="sparkles" :size="15" class="mt-0.5 shrink-0 text-accent-text" />
            <span>
              <strong class="font-medium text-fg">Landed in v1.37:</strong> live data through watches instead of polling, a
              reimagined resource graph, logs across pods, a YAML editor with diff and server-side dry run, rollouts, Helm
              upgrades and debugging, workspaces and split view, and k9s-style keys.
            </span>
          </p>
          <p class="flex gap-2.5">
            <Icon name="sparkles" :size="15" class="mt-0.5 shrink-0 text-accent-text" />
            <span>
              <strong class="font-medium text-fg">And in v1.36:</strong> multi-cluster and multi-namespace views, a built-in
              kubectl terminal, a complete redesign and Linux ARM64 builds.
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
