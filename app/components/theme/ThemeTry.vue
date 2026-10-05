<script setup lang="ts">
/*
 * Drop / pick / paste a theme file; the vendored engine (a lazy chunk,
 * loaded on first use or when the pointer comes near) converts it in the
 * browser and the page paints the previewer with it.
 */
import type { ImportOutcome, ImportedTheme, ThemeSource } from "~/lib/customTheme";

const emit = defineEmits<{ imported: [themes: ImportedTheme[]] }>();
const props = defineProps<{ current?: string | null }>();

const MAX_BYTES = 512 * 1024;
const SAMPLE = `// A VS Code colour theme. JSONC: comments and trailing commas are fine.
{
  "name": "Harbour Night",
  "type": "dark",
  "colors": {
    "editor.background": "#0f1720",
    "editor.foreground": "#d8e1e8",
    "sideBar.background": "#0b1219",
    "list.activeSelectionBackground": "#1d2b38",
    "button.background": "#f2a65a",
    "focusBorder": "#5fb3b3",
    "terminal.ansiRed": "#ec5f67",
    "terminal.ansiGreen": "#99c794",
    "terminal.ansiYellow": "#fac863",
    "terminal.ansiBlue": "#6699cc",
    "terminal.ansiMagenta": "#c594c5",
    "terminal.ansiCyan": "#5fb3b3",
  },
  "tokenColors": [
    { "scope": "comment", "settings": { "foreground": "#65737e", "fontStyle": "italic" } },
    { "scope": "string", "settings": { "foreground": "#99c794" } },
    { "scope": "constant.numeric", "settings": { "foreground": "#f99157" } },
    { "scope": "constant.language", "settings": { "foreground": "#c594c5" } },
    { "scope": "entity.name.tag", "settings": { "foreground": "#6699cc" } },
    { "scope": "punctuation", "settings": { "foreground": "#5fb3b3" } },
  ],
}
`;

type Engine = typeof import("~/lib/customTheme");
let engine: Promise<Engine> | null = null;
const loadEngine = () => (engine ??= import("~/lib/customTheme"));

const text = ref("");
const dragging = ref(false);
const busy = ref(false);
const result = ref<ImportOutcome | null>(null);
const fileInput = ref<HTMLInputElement>();
let dragDepth = 0;

const selected = computed(() => {
  const r = result.value;
  if (!r?.ok) return null;
  return r.themes.find((t) => t.preset.id === props.current) ?? r.themes[0]!;
});

async function run(sources: ThemeSource[]) {
  const tooBig = sources.find((s) => s.text.length > MAX_BYTES);
  if (tooBig) {
    result.value = { ok: false, error: `${tooBig.name ?? "The theme"} is larger than 512 KB — that is not a theme file.` };
    return;
  }
  busy.value = true;
  try {
    const { importThemes } = await loadEngine();
    const outcome = importThemes(sources);
    result.value = outcome;
    if (outcome.ok) emit("imported", outcome.themes);
  } catch (error) {
    engine = null;
    result.value = { ok: false, error: `The theme engine could not be loaded (${error instanceof Error ? error.message : error}). Check your connection and try again.` };
  } finally {
    busy.value = false;
  }
}

async function fromFiles(list: FileList | File[] | null | undefined) {
  const files = [...(list ?? [])].slice(0, 8);
  if (!files.length) return;
  const big = files.find((f) => f.size > MAX_BYTES);
  if (big) {
    result.value = { ok: false, error: `${big.name} is larger than 512 KB — that is not a theme file.` };
    return;
  }
  const sources = await Promise.all(files.map(async (file) => ({ name: file.name, text: await file.text() })));
  if (sources.length === 1) text.value = sources[0]!.text;
  await run(sources);
}

function onDrop(event: DragEvent) {
  dragDepth = 0;
  dragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length) return fromFiles(files);
  const dropped = event.dataTransfer?.getData("text/plain");
  if (dropped) {
    text.value = dropped;
    run([{ text: dropped }]);
  }
}
function onDragEnter() {
  dragDepth++;
  dragging.value = true;
  loadEngine();
}
function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) dragging.value = false;
}

function previewPasted() {
  if (text.value.trim()) run([{ text: text.value }]);
}
function loadSample() {
  text.value = SAMPLE;
  run([{ name: "harbour-night-color-theme.json", text: SAMPLE }]);
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const standardName = (name: string) => name.replace(/\.json$/, ".standard.json");
const appearances = (theme: ImportedTheme) => {
  const keys = Object.keys(theme.preset.looks);
  return keys.length === 2 ? "Light and dark" : `${keys[0] === "light" ? "Light" : "Dark"} only`;
};
/* A strip of the imported colours: canvas, chrome, text, primary, status, then the 8 ANSI colours. */
const swatches = (theme: ImportedTheme) =>
  Object.values(theme.preset.looks).map((look) => ({
    appearance: look!.appearance,
    ui: ["background", "surface-1", "foreground", "primary", "success", "warning", "destructive", "info"].map((t) => `hsl(${look!.vars[t]})`),
    ansi: ["red", "green", "yellow", "blue", "magenta", "cyan"].map((c) => (look!.xterm as Record<string, string>)[c]!),
  }));
</script>

<template>
  <div class="card overflow-hidden" @focusin.once="loadEngine">
    <div class="grid lg:grid-cols-[1.15fr_1fr]">
      <!-- input -->
      <div class="p-6 sm:p-8">
        <h3 id="try-title" class="text-xl font-semibold tracking-tight">Try your own theme</h3>
        <p class="mt-2 text-[0.92rem] leading-relaxed text-muted">
          Drop a VS Code theme, a Sublime Text colour scheme, a TextMate theme or a JET Pilot theme file.
          The same engine JET Pilot uses converts it right here in your browser.
        </p>

        <label
          class="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-7 text-center transition-colors focus-within:border-accent"
          :class="dragging ? 'border-accent bg-accent-soft' : 'border-line-strong bg-bg/50 hover:border-accent/60 hover:bg-surface-2'"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <span class="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-text">
            <Icon name="download" :size="18" class="rotate-180" />
          </span>
          <span class="text-[0.92rem] font-medium">
            {{ dragging ? "Drop to preview" : "Drop theme files here" }}
            <span v-if="!dragging" class="font-normal text-muted">or <span class="text-accent-text underline underline-offset-4">browse</span></span>
          </span>
          <span class="font-mono text-[0.7rem] text-faint">.json · .jsonc · .sublime-color-scheme · .tmTheme</span>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".json,.jsonc,.sublime-color-scheme,.tmTheme,.tmtheme,.plist,application/json"
            class="sr-only"
            aria-describedby="try-privacy"
            @change="fromFiles(($event.target as HTMLInputElement).files); ($event.target as HTMLInputElement).value = ''"
          />
        </label>

        <div class="mt-5">
          <div class="flex items-baseline justify-between gap-3">
            <label for="theme-text" class="text-[0.85rem] font-medium">Or paste it</label>
            <button type="button" class="text-[0.8rem] text-accent-text underline-offset-4 hover:underline" @click="loadSample">Use a sample VS Code theme</button>
          </div>
          <textarea
            id="theme-text"
            v-model="text"
            rows="7"
            spellcheck="false"
            autocomplete="off"
            placeholder='{ "name": "My theme", "type": "dark", "colors": { "editor.background": "#1e1e2e" } }'
            class="mt-2 block w-full resize-y rounded-xl border border-line bg-code px-3.5 py-3 font-mono text-[0.76rem] leading-relaxed text-fg placeholder:text-faint focus:border-accent focus:outline-none"
            @keydown.meta.enter.prevent="previewPasted"
            @keydown.ctrl.enter.prevent="previewPasted"
          />
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-[0.88rem] font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
              :disabled="!text.trim() || busy"
              @click="previewPasted"
            >
              <Icon name="sparkles" :size="15" /> Preview
            </button>
            <span class="text-[0.75rem] text-faint"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>
          </div>
        </div>
        <p id="try-privacy" class="mt-5 flex items-start gap-2 text-[0.8rem] leading-relaxed text-faint">
          <Icon name="lock" :size="13" class="mt-0.5 shrink-0" />
          Everything happens in your browser. Nothing is uploaded, nothing is stored.
        </p>
      </div>

      <!-- result -->
      <div class="border-t border-line bg-surface-2/60 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-live="polite">
        <div v-if="busy" class="flex items-center gap-3 text-[0.9rem] text-muted">
          <span class="size-4 animate-spin rounded-full border-2 border-line-strong border-t-accent" aria-hidden="true" />
          Converting…
        </div>

        <div v-else-if="result && !result.ok" role="alert" class="rounded-xl border border-danger/30 bg-danger/10 p-4">
          <p class="flex items-center gap-2 text-[0.9rem] font-semibold text-danger"><Icon name="alert" :size="15" /> That didn’t import</p>
          <p class="mt-1.5 break-words text-[0.85rem] leading-relaxed text-fg/85">{{ result.error }}</p>
        </div>

        <div v-else-if="result && result.ok && selected">
          <p class="flex items-center gap-2 text-[0.8rem] text-success"><Icon name="check" :size="14" /> {{ result.format }} imported</p>
          <p class="mt-2 text-2xl font-semibold tracking-tight">{{ selected.preset.name }}</p>
          <p class="mt-1 text-[0.85rem] text-muted">
            {{ appearances(selected) }}<template v-if="result.themes.length > 1"> · {{ result.themes.length }} themes — pick one under “Yours”</template>
          </p>
          <div class="mt-4 space-y-1.5" aria-hidden="true">
            <div v-for="row in swatches(selected)" :key="row.appearance" class="flex items-center gap-1">
              <span class="w-10 text-[0.68rem] capitalize text-faint">{{ row.appearance }}</span>
              <span v-for="(c, i) in row.ui" :key="`u${i}`" class="size-5 rounded-md ring-1 ring-black/10 dark:ring-white/10" :style="{ background: c }" />
              <span class="mx-1 h-4 w-px bg-line-strong" />
              <span v-for="(c, i) in row.ansi" :key="`a${i}`" class="size-3.5 rounded ring-1 ring-black/10 dark:ring-white/10" :style="{ background: c }" />
            </div>
          </div>
          <div class="mt-5 flex flex-wrap gap-2">
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-[0.85rem] font-semibold text-bg transition-opacity hover:opacity-90" @click="download(selected.fileName, selected.jet)">
              <Icon name="download" :size="15" /> Download as JET Pilot theme
            </button>
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong px-4 text-[0.85rem] font-semibold transition-colors hover:bg-fg/5" title="The theme with every colour role resolved and without JET Pilot-only extras" @click="download(standardName(selected.fileName), selected.standard)">
              Download standard theme
            </button>
          </div>
          <p class="mt-3 text-[0.8rem] leading-relaxed text-faint">
            Drop the download into JET Pilot’s themes folder or import it under Settings › Appearance.
            <a href="#preview" class="text-accent-text underline-offset-4 hover:underline">See it in the preview ↑</a>
          </p>
          <details v-if="result.warnings.length" class="group mt-5 rounded-xl border border-warning/30 bg-warning/10 p-3.5">
            <summary class="flex cursor-pointer list-none items-center gap-2 text-[0.82rem] font-medium text-warning [&::-webkit-details-marker]:hidden">
              <Icon name="info" :size="14" /> {{ result.warnings.length }} note{{ result.warnings.length === 1 ? "" : "s" }} from the importer
              <Icon name="chevronDown" :size="14" class="ml-auto transition-transform group-open:rotate-180" />
            </summary>
            <ul class="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-fg/80">
              <li v-for="(warning, i) in result.warnings" :key="i">{{ warning }}</li>
            </ul>
          </details>
        </div>

        <div v-else>
          <p class="text-[0.85rem] font-medium">What works</p>
          <ul class="mt-3 space-y-3 text-[0.85rem] leading-relaxed text-muted">
            <li class="flex gap-3"><span class="mt-0.5 w-[4.6rem] shrink-0 self-start whitespace-nowrap rounded-md border border-line bg-surface-3 py-px text-center font-mono text-[0.68rem] text-fg">VS Code</span><span><code>*-color-theme.json</code> — workbench colours, <code>tokenColors</code> for the editor and <code>terminal.ansi*</code> for the terminal. JSONC and <code>include</code> are fine.</span></li>
            <li class="flex gap-3"><span class="mt-0.5 w-[4.6rem] shrink-0 self-start whitespace-nowrap rounded-md border border-line bg-surface-3 py-px text-center font-mono text-[0.68rem] text-fg">Sublime</span><span><code>.sublime-color-scheme</code>, with variables and <code>color()</code>.</span></li>
            <li class="flex gap-3"><span class="mt-0.5 w-[4.6rem] shrink-0 self-start whitespace-nowrap rounded-md border border-line bg-surface-3 py-px text-center font-mono text-[0.68rem] text-fg">TextMate</span><span><code>.tmTheme</code> property lists.</span></li>
            <li class="flex gap-3"><span class="mt-0.5 w-[4.6rem] shrink-0 self-start whitespace-nowrap rounded-md border border-line bg-surface-3 py-px text-center font-mono text-[0.68rem] text-fg">JET Pilot</span><span>JET Pilot theme files — the short two-colour form or a full palette.</span></li>
          </ul>
          <p class="mt-5 text-[0.8rem] leading-relaxed text-faint">Light and dark files of one theme? Drop both at once — they pair up into one theme, as in the app.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
}
kbd {
  border-radius: 0.3rem;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  padding: 0.05rem 0.3rem;
  font-size: 0.9em;
}
</style>
