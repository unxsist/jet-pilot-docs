<script setup lang="ts">
import themesData from "~/data/themes.json";
import examples from "~/data/theme-examples.json";
import type { Appearance, ThemePreset } from "~/lib/themeLook";
import type { ImportedTheme } from "~/lib/customTheme";
import { REPO_URL } from "~/composables/useGitHub";

const PAGE_URL = "https://www.jet-pilot.app/themes/";
const title = "Themes — Make JET Pilot yours";
const description =
  "Custom themes for JET Pilot, the Kubernetes desktop client: import VS Code, Sublime Text, TextMate and T3 Code themes, install MIT-licensed themes from Open VSX, or write your own JSON theme. Preview every built-in theme — and your own — right here.";

useHead({ link: [{ rel: "canonical", href: PAGE_URL }] });
useSeoMeta({
  title,
  description,
  ogType: "website",
  ogSiteName: "JET Pilot",
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://www.jet-pilot.app/images/og-themes.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "JET Pilot themes: the app's pods table, terminal and YAML editor in the Catppuccin theme, with theme chips for JET, Tokyo Night, Dracula, Nord and more.",
  ogUrl: PAGE_URL,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-themes.png",
});

/* ------------------------------------------------------------ previewer */

const builtins = themesData.themes as unknown as ThemePreset[];
const yours = ref<(ImportedTheme & { preset: ThemePreset })[]>([]);
const presets = computed<ThemePreset[]>(() => [...builtins, ...yours.value.map((t) => t.preset)]);

const themeId = ref("jet");
const mode = ref<Appearance>("dark");
const view = ref<"pods" | "graph">("pods");
const modeChosen = ref(false);

const preset = computed(() => presets.value.find((p) => p.id === themeId.value) ?? builtins[0]!);
const appearances = computed(() => (["light", "dark"] as const).filter((a) => preset.value.looks[a]));
const only = computed(() => (appearances.value.length === 1 ? appearances.value[0]! : null));
const shownMode = computed<Appearance>(() => (preset.value.looks[mode.value] ? mode.value : appearances.value[0]!));
const look = computed(() => preset.value.looks[shownMode.value]!);
const replicaLabel = computed(
  () =>
    `JET Pilot in the ${preset.value.name} theme (${shownMode.value}): the sidebar, the pods table with statuses and CPU sparklines, a terminal running kubectl get pods and the YAML editor`
);

const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();

onMounted(() => {
  const q = route.query;
  const wantedTheme = typeof q.theme === "string" ? q.theme : null;
  if (wantedTheme && builtins.some((p) => p.id === wantedTheme)) themeId.value = wantedTheme;
  if (q.mode === "light" || q.mode === "dark") {
    mode.value = q.mode;
    modeChosen.value = true;
  } else if (colorMode.value === "light" || colorMode.value === "dark") {
    mode.value = colorMode.value;
  }
  if (q.view === "graph") view.value = "graph";

  // Until a mode is picked here, the preview follows the site's light/dark switch.
  watch(
    () => colorMode.value,
    (value) => {
      if (!modeChosen.value && (value === "light" || value === "dark")) mode.value = value;
    }
  );
  watch([themeId, mode, view], () => {
    const custom = themeId.value.startsWith("yours-");
    const query: Record<string, string> = {};
    if (!custom && themeId.value !== "jet") query.theme = themeId.value;
    if (!custom && modeChosen.value) query.mode = mode.value;
    if (view.value === "graph") query.view = "graph";
    // Keep the trailing slash GitHub Pages serves the page at, so copied URLs don't redirect.
    router.replace({ path: "/themes/", query, hash: route.hash });
  });
});

function setMode(value: Appearance) {
  mode.value = value;
  modeChosen.value = true;
}

const shareCopied = ref(false);
async function copyLink() {
  const url = new URL(location.href);
  url.hash = "preview";
  url.searchParams.set("mode", shownMode.value);
  try {
    await navigator.clipboard.writeText(url.toString());
    shareCopied.value = true;
    setTimeout(() => (shareCopied.value = false), 1800);
  } catch {
    /* clipboard unavailable */
  }
}

const replica = ref<HTMLElement>();
function onImported(themes: ImportedTheme[]) {
  yours.value = themes;
  themeId.value = themes[0]!.preset.id;
  const el = replica.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
  if (visible < rect.height * 0.5) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }
}

/* ------------------------------------------------------------- content */

/* Pretty JSON with short flat objects on one line, like a hand-written file. */
function pretty(value: unknown, indent = ""): string {
  if (Array.isArray(value)) return `[${value.map((v) => pretty(v, indent)).join(", ")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    const flat = entries.every(([, v]) => typeof v !== "object" || v === null);
    const inline = `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ")} }`;
    if (flat && inline.length + indent.length < 78 && entries.length <= 4) return inline;
    const inner = indent + "  ";
    return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${pretty(v, inner)}`).join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}
const seededJson = pretty(examples.seeded);
const fullJson = pretty(examples.full);
const schemaLine = `"$schema": "${themesData.schemaUri}"`;

const folders = [
  { os: "macOS", icon: "apple", path: "~/Library/Application Support/com.unxsist.jetpilot/themes" },
  { os: "Windows", icon: "windows", path: "%APPDATA%\\com.unxsist.jetpilot\\themes" },
  { os: "Linux", icon: "linux", path: "~/.config/com.unxsist.jetpilot/themes" },
];

const credits = themesData.credits;
</script>

<template>
  <main id="main" class="themes-page">
    <!-- Hero + previewer -->
    <section class="relative isolate overflow-hidden pt-28 sm:pt-36" aria-labelledby="themes-title">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div class="bg-grid absolute inset-0 opacity-70 dark:opacity-100" />
        <div
          class="absolute left-1/2 top-[-18rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-full opacity-60 dark:opacity-50"
          style="background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 38%, transparent), transparent)"
        />
      </div>

      <div class="container-x text-center">
        <p class="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-3 text-[0.8rem] text-muted shadow-card backdrop-blur">
          <span class="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[0.72rem] font-semibold text-white">New in v1.38</span>
          <span class="truncate">Custom themes, from the editors you already love</span>
        </p>
        <h1 id="themes-title" class="mx-auto mt-7 max-w-4xl text-balance text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[5.25rem]">
          <span class="text-shine">Make JET Pilot</span>{{ " " }}<span class="text-accent-shine pb-1">yours.</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-[1.075rem] leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
          Bring your VS Code, Sublime Text, TextMate or T3 Code theme — or pick one of the built-ins. The
          sidebar, tables, YAML editor and terminal all follow.
        </p>
        <ul class="mt-7 flex flex-wrap items-center justify-center gap-2 text-[0.78rem]" aria-label="Highlights">
          <li v-for="tag in ['T3 Code compatible', 'VS Code · Sublime · TextMate', 'Open VSX gallery', 'JSON editor with live preview', 'MIT']" :key="tag" class="rounded-full border border-line bg-surface/60 px-3 py-1 text-muted">
            {{ tag }}
          </li>
        </ul>
      </div>

      <!-- previewer -->
      <div id="preview" class="container-x relative mt-14 scroll-mt-20 sm:mt-16">
        <div class="mx-auto max-w-[72rem]">
          <ThemePicker v-model="themeId" :presets="presets" :mode="shownMode" />

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Appearance" class="inline-flex rounded-xl border border-line bg-surface/70 p-1" :class="{ 'opacity-60': only }">
              <button
                v-for="m in (['light', 'dark'] as const)"
                :key="m"
                type="button"
                :aria-pressed="shownMode === m"
                :disabled="!!only"
                class="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[0.82rem] font-medium capitalize transition-colors disabled:cursor-not-allowed"
                :class="shownMode === m ? 'bg-fg text-bg' : 'text-muted hover:text-fg'"
                @click="setMode(m)"
              >
                <Icon :name="m === 'light' ? 'sun' : 'moon'" :size="14" />{{ m }}
              </button>
            </div>
            <div role="group" aria-label="Screen" class="inline-flex rounded-xl border border-line bg-surface/70 p-1">
              <button
                v-for="v in ([['pods', 'Pods & terminal', 'Pods'], ['graph', 'Resource graph', 'Graph']] as const)"
                :key="v[0]"
                type="button"
                :aria-pressed="view === v[0]"
                class="inline-flex h-8 items-center rounded-lg px-3 text-[0.82rem] font-medium transition-colors"
                :class="view === v[0] ? 'bg-fg text-bg' : 'text-muted hover:text-fg'"
                @click="view = v[0]"
              >
                <span class="max-sm:hidden">{{ v[1] }}</span><span class="sm:hidden">{{ v[2] }}</span>
              </button>
            </div>
            <p v-if="only" class="flex items-center gap-1.5 text-[0.8rem] text-muted max-lg:order-last max-lg:w-full">
              <Icon name="info" :size="14" class="shrink-0 text-faint" />
              {{ preset.name }} only has a {{ only }} appearance — in JET Pilot it becomes your {{ only }}-mode theme.
            </p>
            <button
              type="button"
              class="ml-auto inline-flex h-10 items-center gap-1.5 rounded-xl border border-line px-3 text-[0.8rem] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
              :aria-label="shareCopied ? 'Link copied' : 'Copy a link to this preview'"
              @click="copyLink"
            >
              <Icon :name="shareCopied ? 'check' : 'copy'" :size="13" :class="shareCopied ? 'text-success' : ''" />
              <span class="max-sm:hidden" aria-hidden="true">{{ shareCopied ? "Link copied" : "Copy link" }}</span>
            </button>
          </div>

          <div ref="replica" class="relative mt-5">
            <div
              aria-hidden="true"
              class="absolute -inset-x-8 -top-8 bottom-1/3 -z-10 rounded-[3rem] opacity-60 transition-[background] duration-500"
              :style="{ background: `radial-gradient(closest-side, hsl(${look.vars.primary} / 0.35), transparent)` }"
            />
            <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
              <ThemeReplica :look="look" :view="view" :label="replicaLabel" class="rounded-[13px]" />
            </div>
          </div>
          <p class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.8rem] text-faint">
            <span class="font-medium text-fg">{{ preset.name }}</span>
            <span aria-hidden="true">·</span>
            <span class="capitalize">{{ shownMode }}</span>
            <template v-if="preset.origin?.label && preset.group !== 'Yours'">
              <span aria-hidden="true">·</span>
              <a v-if="preset.origin.url" :href="preset.origin.url" class="underline decoration-line-strong underline-offset-4 hover:text-fg">{{ preset.origin.author ?? preset.origin.label }}</a>
              <span v-else>{{ preset.origin.author ?? preset.origin.label }}</span>
              <span v-if="preset.origin.license">({{ preset.origin.license }})</span>
            </template>
            <template v-else-if="preset.group === 'Yours'">
              <span aria-hidden="true">·</span><span>Your theme, converted in this browser</span>
            </template>
          </p>
        </div>
      </div>

      <!-- try your own -->
      <div id="try" class="container-x mt-16 scroll-mt-20 sm:mt-20">
        <div class="mx-auto max-w-[72rem]" role="region" aria-labelledby="try-title">
          <ThemeTry :current="themeId" @imported="onImported" />
        </div>
      </div>
    </section>

    <!-- Install -->
    <section id="install" class="relative cv-auto py-20 sm:py-28" aria-labelledby="install-title">
      <div class="container-x">
        <div data-reveal class="mx-auto max-w-2xl text-center">
          <span class="eyebrow">How to install</span>
          <h2 id="install-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">Three ways in. All of them instant.</h2>
          <p class="mt-4 leading-relaxed text-muted">Every theme can have its own light and dark appearance, and you can pick a different theme for each mode.</p>
        </div>

        <div class="mt-14 grid gap-4 lg:grid-cols-3">
          <article data-reveal class="card flex flex-col p-6 sm:p-7">
            <span class="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-text"><Icon name="palette" :size="18" /></span>
            <h3 class="mt-5 text-lg font-semibold tracking-tight">Settings › Appearance</h3>
            <p class="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Drag theme files onto the theme library, pick them with the file picker or paste the JSON. VS Code, Sublime,
              TextMate and T3 Code themes are converted on the spot. Hover a card to preview it on the whole app.
            </p>
            <div class="mt-auto pt-6" aria-hidden="true">
              <div class="rounded-xl border border-dashed border-line-strong bg-bg/60 p-3">
                <div class="flex flex-wrap items-center gap-2 text-[0.74rem]">
                  <span class="rounded-md border border-line bg-surface-3 px-2 py-1 font-mono text-[0.7rem]">tokyo-night-color-theme.json</span>
                  <span class="rounded-md border border-line bg-surface-3 px-2 py-1 font-mono text-[0.7rem]">tokyo-night-light-color-theme.json</span>
                </div>
                <p class="mt-2.5 flex items-center gap-1.5 text-[0.76rem] text-success"><Icon name="check" :size="13" /> Tokyo Night · light + dark</p>
              </div>
              <p class="mt-3 text-[0.8rem] text-faint">Light and dark files of one theme pair up automatically.</p>
            </div>
          </article>

          <article data-reveal style="--reveal-delay: 80ms" class="card flex flex-col p-6 sm:p-7">
            <span class="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-text"><Icon name="search" :size="18" /></span>
            <h3 class="mt-5 text-lg font-semibold tracking-tight">The Open VSX gallery</h3>
            <p class="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Search thousands of VS Code themes on <a href="https://open-vsx.org" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">open-vsx.org</a>
              from inside JET Pilot and install one in a click — every colour theme in the extension comes along.
            </p>
            <div class="mt-auto pt-6">
              <ul class="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg/60 text-[0.76rem]" aria-hidden="true">
                <li v-for="ext in [['Catppuccin for VSCode', 'MIT', true], ['GitHub Theme', 'MIT', true], ['A GPL-licensed theme', 'GPL-3.0', false]]" :key="String(ext[0])" class="flex items-center gap-2 px-3 py-2" :class="ext[2] ? '' : 'opacity-60'">
                  <span class="truncate font-medium">{{ ext[0] }}</span>
                  <span class="shrink-0 rounded border border-line px-1 font-mono text-[0.65rem] text-muted">{{ ext[1] }}</span>
                  <span v-if="ext[2]" class="ml-auto shrink-0 rounded-md bg-fg px-2 py-0.5 text-[0.7rem] font-semibold text-bg">Install</span>
                  <span v-else class="ml-auto shrink-0 text-[0.7rem] text-faint">Not MIT</span>
                </li>
              </ul>
              <p class="mt-3 flex gap-2 text-[0.8rem] leading-relaxed text-faint">
                <Icon name="scale" :size="14" class="mt-0.5 shrink-0" />
                Only MIT-licensed extensions can be installed, so JET Pilot stays MIT.
              </p>
            </div>
          </article>

          <article data-reveal style="--reveal-delay: 160ms" class="card flex flex-col p-6 sm:p-7">
            <span class="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-text"><Icon name="layers" :size="18" /></span>
            <h3 class="mt-5 text-lg font-semibold tracking-tight">The themes folder</h3>
            <p class="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Save a <code>.json</code> theme in JET Pilot’s themes folder. It’s watched: edit the file in any editor and
              the app updates as you save. Broken files show up with their error, not silently.
            </p>
            <dl class="mt-5 space-y-2">
              <div v-for="folder in folders" :key="folder.os" class="rounded-lg border border-line bg-bg/60 px-3 py-2">
                <dt class="flex items-center gap-1.5 text-[0.72rem] font-medium text-faint"><Icon :name="folder.icon" :size="12" />{{ folder.os }}</dt>
                <dd class="mt-0.5 break-all font-mono text-[0.72rem] text-fg/90">{{ folder.path }}</dd>
              </div>
            </dl>
          </article>
        </div>

        <div data-reveal class="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          <div class="bg-bg p-5 sm:p-6">
            <p class="flex flex-wrap items-center gap-1"><kbd>⌘</kbd><kbd>⌥</kbd><kbd>A</kbd><span class="mx-1 text-faint">/</span><kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>A</kbd></p>
            <p class="mt-3 font-medium">Change theme…</p>
            <p class="mt-1 text-[0.88rem] leading-relaxed text-muted">The command palette lists every theme. Arrow through them to preview live; <kbd>Esc</kbd> puts the old one back.</p>
          </div>
          <div class="bg-bg p-5 sm:p-6">
            <p class="flex flex-wrap items-center gap-1"><kbd>⌘</kbd><kbd>⌥</kbd><kbd>⇧</kbd><kbd>A</kbd><span class="mx-1 text-faint">/</span><kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>Shift</kbd><kbd>A</kbd></p>
            <p class="mt-3 font-medium">Change appearance</p>
            <p class="mt-1 text-[0.88rem] leading-relaxed text-muted">Switch between System, Light and Dark. Each mode keeps its own theme.</p>
          </div>
          <div class="bg-bg p-5 sm:p-6">
            <p class="flex flex-wrap items-center gap-1"><kbd>⌘</kbd><kbd>K</kbd><span class="mx-1 text-faint">/</span><kbd>Ctrl</kbd><kbd>K</kbd></p>
            <p class="mt-3 font-medium">Or just search</p>
            <p class="mt-1 text-[0.88rem] leading-relaxed text-muted">Type “theme” in the command palette. Shortcuts are listed in the <kbd>?</kbd> cheat sheet.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Write your own -->
    <section id="write" class="relative cv-auto py-20 sm:py-28" aria-labelledby="write-title">
      <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div class="container-x">
        <div class="grid gap-12 lg:grid-cols-12">
          <div data-reveal class="self-start lg:sticky lg:top-24 lg:col-span-5">
            <span class="eyebrow">Write your own</span>
            <h2 id="write-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">Two colours are enough.</h2>
            <p class="mt-4 leading-relaxed text-muted">
              A theme is a small JSON file. Give it a <code>canvas</code> and an <code>accent</code> and JET Pilot derives
              the rest of the palette from them — with contrast guarantees: text at 7:1, other foregrounds at 4.5:1 and
              buttons at 3:1.
            </p>
            <ul class="mt-6 space-y-3">
              <li v-for="point in [
                'Override any of the 57 roles under <code>colors</code>',
                'Add the other appearance under <code>variants</code>',
                'JET Pilot extras under <code>jetPilot</code>: success and info colours, the 16 terminal colours, editor syntax colours and raw VS Code editor keys',
                'Any CSS colour works: hex, <code>rgb()</code>, <code>hsl()</code>, <code>oklch()</code>…',
              ]" :key="point" class="flex gap-3 text-[0.95rem] leading-relaxed">
                <span class="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span class="text-fg/85" v-html="point" />
              </li>
            </ul>

            <div class="card mt-8 p-5">
              <p class="flex items-center gap-2 text-[0.85rem] font-medium"><Icon name="code" :size="15" class="text-accent-text" /> Completion and validation, everywhere</p>
              <p class="mt-2 text-[0.88rem] leading-relaxed text-muted">Add the schema line and VS Code (or any JSON Schema-aware editor) completes role names, explains them on hover and flags mistakes:</p>
              <p class="mt-3 overflow-x-auto rounded-lg border border-line bg-code px-3 py-2 font-mono text-[0.72rem] whitespace-nowrap">
                <span class="text-accent-text">"$schema"</span><span class="text-faint">: </span><span class="text-success">"{{ themesData.schemaUri }}"</span>
              </p>
              <p class="mt-3 text-[0.85rem] leading-relaxed text-muted">
                Inside the app, Settings › Appearance › <strong class="font-medium text-fg">New theme</strong> opens a JSON editor with the
                same schema, a live preview on the whole app and <kbd>⌘S</kbd> / <kbd>Ctrl+S</kbd> to save.
              </p>
            </div>
          </div>

          <div class="space-y-4 lg:col-span-7">
            <div data-reveal><ThemeJsonBlock :code="seededJson" filename="nightfall.json" title="The short form" /></div>
            <div data-reveal style="--reveal-delay: 80ms"><ThemeJsonBlock :code="fullJson" filename="nightfall.json" title="With overrides, a light variant and JET Pilot extras" /></div>
          </div>
        </div>

        <!-- T3 compatibility -->
        <div data-reveal class="mt-16 grid gap-4 md:grid-cols-3">
          <div class="card p-6">
            <p class="font-medium">T3 Code themes import as they are</p>
            <p class="mt-2 text-[0.88rem] leading-relaxed text-muted">The format is T3 Code’s theme file (version 1, its 57 roles, the seeded short form and variants). Paste a T3 theme and you’re done.</p>
          </div>
          <div class="card p-6">
            <p class="font-medium">And they go back, too</p>
            <p class="mt-2 text-[0.88rem] leading-relaxed text-muted">T3 Code ignores the <code>jetPilot</code> block. <strong class="font-medium text-fg">Export for T3 Code</strong> writes a strict T3 file: all 57 roles resolved, variants included.</p>
          </div>
          <div class="card p-6">
            <p class="font-medium">More than a palette</p>
            <p class="mt-2 text-[0.88rem] leading-relaxed text-muted">VS Code themes bring their <code>tokenColors</code> to the YAML editor and <code>terminal.ansi*</code> to the terminal — the parts T3 Code leaves out.</p>
          </div>
        </div>

        <!-- Roles reference -->
        <div class="mt-20">
          <div data-reveal class="max-w-2xl">
            <h3 id="roles" class="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Roles reference</h3>
            <p class="mt-3 leading-relaxed text-muted">
              Every key a theme can set, straight from the
              <a :href="themesData.schemaUri" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">JSON schema</a>.
              Roles marked T3 Code are kept for compatibility; JET Pilot paints the rest.
            </p>
          </div>
          <div data-reveal class="mt-8"><LazyThemeRolesReference hydrate-never /></div>
        </div>
      </div>
    </section>

    <!-- Credits -->
    <section id="credits" class="relative cv-auto pb-24 pt-4 sm:pb-28" aria-labelledby="credits-title">
      <div class="container-x">
        <div data-reveal class="card overflow-hidden">
          <div class="p-6 sm:p-8">
            <span class="eyebrow">Credits</span>
            <h2 id="credits-title" class="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Built on the shoulders of great themes.</h2>
            <p class="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted">
              The built-in themes are converted from their upstream projects, all under the MIT licence. Palettes and parts of
              the theme engine — the palette derivation, the contrast solver and the VS Code mapping — are ported from
              <a href="https://github.com/pingdotgg/t3code" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">T3 Code</a> (MIT). Thank you.
            </p>
          </div>
          <div class="overflow-x-auto border-t border-line">
            <table class="w-full min-w-[40rem] text-left text-[0.85rem]">
              <thead class="text-[0.75rem] text-faint">
                <tr class="border-b border-line">
                  <th scope="col" class="px-6 py-3 font-medium sm:px-8">Theme</th>
                  <th scope="col" class="px-4 py-3 font-medium">Upstream</th>
                  <th scope="col" class="px-4 py-3 font-medium">Licence</th>
                  <th scope="col" class="px-6 py-3 font-medium sm:px-8">Copyright</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="credit in credits" :key="credit.themes" class="border-b border-line last:border-0">
                  <th scope="row" class="px-6 py-3 font-medium sm:px-8">{{ credit.themes }}</th>
                  <td class="px-4 py-3">
                    <a v-if="'url' in credit.upstream" :href="credit.upstream.url" class="font-mono text-[0.78rem] text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">{{ credit.upstream.label }}</a>
                    <span v-else class="font-mono text-[0.78rem] text-muted">{{ credit.upstream.label }}</span>
                  </td>
                  <td class="px-4 py-3 text-muted">{{ credit.license }}</td>
                  <td class="px-6 py-3 text-muted sm:px-8">{{ credit.copyright }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="border-t border-line px-6 py-4 text-[0.8rem] text-faint sm:px-8">
            Full notices in
            <a :href="`${REPO_URL}/blob/main/THIRD_PARTY_THEMES.md`" class="underline decoration-line-strong underline-offset-4 hover:text-fg">THIRD_PARTY_THEMES.md</a>.
            JET is JET Pilot’s own theme.
          </p>
        </div>
      </div>
    </section>

    <LazySiteFooter hydrate-on-visible />
  </main>
</template>

<style>
.themes-page :not(pre) > code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
}
.themes-page kbd:not(.jp kbd) {
  display: inline-flex;
  min-width: 1.5rem;
  justify-content: center;
  border-radius: 0.35rem;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  padding: 0.05rem 0.35rem;
  font-family: var(--font-sans);
  font-size: 0.78em;
  box-shadow: 0 1px 0 var(--line-strong);
}
</style>
