<script setup lang="ts">
/*
 * Homepage teaser for custom themes (v1.38): real screenshots in tabs and
 * the built-in palettes as chips, linking to /themes/. The swatches come
 * from app/data/theme-swatches.json (a few colours per theme), so the
 * full theme data and the engine stay on /themes/.
 */
import swatches from "~/data/theme-swatches.json";

const shots = [
  {
    id: "library",
    label: "Theme library",
    shot: "themes-library",
    zoom: 1.3,
    focus: "100% 12%",
    alt: "Settings › Appearance in the Rosé Pine theme: theme cards with live mini previews for JET, Catppuccin, Tokyo Night, Dracula, Nord, GitHub, One Dark Pro, Rosé Pine and Gruvbox, each with light and dark badges",
  },
  {
    id: "editor",
    label: "JSON editor",
    shot: "themes-editor",
    zoom: 1.3,
    focus: "30% 0%",
    alt: "The JSON theme editor previewing a theme called Harbour on the whole app: the theme file with colour swatches, schema completion and the list of derived roles",
  },
  {
    id: "palette",
    label: "Change theme…",
    shot: "themes-palette",
    zoom: 1.25,
    focus: "55% 0%",
    alt: "The command palette's Change theme command filtered to Tokyo Night, previewing it live on the pods table",
  },
  {
    id: "pods",
    label: "Catppuccin",
    shot: "themes-catppuccin",
    zoom: 1.2,
    focus: "0% 0%",
    alt: "The pods table across two clusters in the Catppuccin theme: Latte in light mode, Mocha in dark mode",
  },
];
const active = ref("library");
const points = [
  'Import <strong>VS Code</strong>, <strong>Sublime Text</strong>, <strong>TextMate</strong> and <strong>T3 Code</strong> themes — editor syntax and terminal colours included',
  'Install from <strong>Open VSX</strong> in a click (MIT-licensed themes)',
  'A JSON editor with schema completion and a live preview',
  '<kbd>⌘⌥A</kbd> / <kbd>Ctrl+Alt+A</kbd> to switch, with a preview as you arrow through',
];

const onKey = (event: KeyboardEvent) => {
  const i = shots.findIndex((s) => s.id === active.value);
  const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
  if (!delta) return;
  event.preventDefault();
  const next = shots[(i + delta + shots.length) % shots.length]!;
  active.value = next.id;
  nextTick(() => document.getElementById(`themes-tab-${next.id}`)?.focus());
};
</script>

<template>
  <section id="themes" class="relative cv-auto py-14 sm:py-20" aria-labelledby="themes-teaser-title">
    <div class="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div data-reveal class="lg:col-span-4">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex size-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent-text shadow-card">
            <Icon name="palette" :size="16" />
          </span>
          <span class="eyebrow">Themes</span>
          <span class="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[0.68rem] font-semibold text-accent-text">New</span>
        </div>
        <h3 id="themes-teaser-title" class="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]">
          Your colours. Every pixel.
        </h3>
        <p class="mt-4 text-[1.02rem] leading-relaxed text-muted">
          Bring the theme you already love, or pick one of the built-ins. The sidebar, tables, resource graph, YAML
          editor and terminal all follow — in light and dark.
        </p>
        <ul class="mt-6 space-y-3">
          <li v-for="point in points" :key="point" class="flex gap-3 text-[0.95rem] leading-relaxed">
            <span class="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span class="text-fg/85" v-html="point" />
          </li>
        </ul>
        <div class="mt-7 flex flex-wrap gap-3">
          <a href="/themes/" class="group inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-4 text-[0.9rem] font-semibold text-bg transition-transform hover:-translate-y-px">
            Preview the themes <Icon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href="/themes/#try" class="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-[0.9rem] font-semibold transition-colors hover:bg-fg/5">
            Try yours
          </a>
        </div>
      </div>

      <div data-reveal style="--reveal-delay: 120ms" class="relative lg:col-span-8">
        <div role="tablist" aria-label="Theme screenshots" class="mb-4 flex flex-wrap gap-1.5" @keydown="onKey">
          <button
            v-for="s in shots"
            :id="`themes-tab-${s.id}`"
            :key="s.id"
            type="button"
            role="tab"
            :aria-selected="active === s.id"
            :aria-controls="`themes-panel-${s.id}`"
            :tabindex="active === s.id ? 0 : -1"
            class="rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition-colors"
            :class="active === s.id ? 'border-accent/50 bg-accent-soft text-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg'"
            @click="active = s.id"
          >
            {{ s.label }}
          </button>
        </div>
        <div
          aria-hidden="true"
          class="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-40 dark:opacity-30"
          style="background: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)"
        />
        <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
          <div class="overflow-hidden rounded-[13px] bg-surface">
            <div
              v-for="s in shots"
              v-show="active === s.id"
              :id="`themes-panel-${s.id}`"
              :key="s.id"
              role="tabpanel"
              :aria-labelledby="`themes-tab-${s.id}`"
            >
              <div :style="{ transform: `scale(${s.zoom})`, transformOrigin: s.focus }">
                <AppShot :name="s.shot" :alt="s.alt" sizes="(min-width: 1024px) 1100px, 100vw" />
              </div>
            </div>
          </div>
        </div>
        <ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Built-in themes">
          <li v-for="t in swatches" :key="t.id">
            <a
              :href="`/themes/?theme=${t.id}`"
              class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 py-1 pl-1 pr-2.5 text-[0.75rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <span class="flex overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10" aria-hidden="true">
                <span v-for="(c, i) in (t.looks.dark ?? t.looks.light)" :key="i" class="h-3.5 w-1.5" :style="{ background: c }" />
              </span>
              {{ t.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
