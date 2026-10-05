<script setup lang="ts">
/*
 * Theme chips (one radio group across all groups: arrows move and select,
 * Home / End jump) and a mini app preview per chip.
 */
import type { Appearance, ThemePreset } from "~/lib/themeLook";

const props = defineProps<{ presets: ThemePreset[]; mode: Appearance }>();
const selected = defineModel<string>({ required: true });

const groups = computed(() => {
  const order = ["Built-in", "T3 Code", "Yours"] as const;
  return order
    .map((label) => ({ label, items: props.presets.filter((p) => p.group === label) }))
    .filter((g) => g.items.length);
});
const flat = computed(() => groups.value.flatMap((g) => g.items));

const lookFor = (preset: ThemePreset) => preset.looks[props.mode] ?? preset.looks.dark ?? preset.looks.light!;
const only = (preset: ThemePreset) => {
  const keys = Object.keys(preset.looks);
  return keys.length === 1 ? (keys[0] as Appearance) : null;
};
const hsl = (triplet: string | undefined) => (triplet ? `hsl(${triplet})` : "transparent");

const root = ref<HTMLElement>();
function onKey(event: KeyboardEvent) {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const list = flat.value;
  const index = list.findIndex((p) => p.id === selected.value);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? list.length - 1
        : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + list.length) % list.length;
  selected.value = list[next]!.id;
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-theme-id="${list[next]!.id}"]`)?.focus());
}
</script>

<template>
  <div ref="root" role="radiogroup" aria-label="Theme" class="space-y-3 sm:space-y-4" @keydown="onKey">
    <div v-for="group in groups" :key="group.label" class="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <p class="w-20 shrink-0 font-mono sm:pt-3 text-[0.68rem] uppercase tracking-[0.12em] text-faint" aria-hidden="true">{{ group.label }}</p>
      <div class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        <button
          v-for="preset in group.items"
          :key="preset.id"
          type="button"
          role="radio"
          :data-theme-id="preset.id"
          :aria-checked="preset.id === selected"
          :tabindex="preset.id === selected ? 0 : -1"
          :aria-label="`${preset.name}${only(preset) ? ` (${only(preset)} only)` : ''}${group.label === 'T3 Code' ? ', from T3 Code' : ''}`"
          class="group/chip inline-flex h-10 shrink-0 items-center gap-2.5 rounded-xl border pl-1.5 pr-3 text-[0.85rem] font-medium transition-[border-color,background-color,box-shadow] duration-200"
          :class="
            preset.id === selected
              ? 'border-accent/60 bg-accent-soft text-fg shadow-[0_0_0_3px_var(--accent-soft)]'
              : 'border-line bg-surface/70 text-muted hover:border-line-strong hover:text-fg'
          "
          @click="selected = preset.id"
        >
          <!-- mini window: chrome, canvas, a primary pill and two text lines -->
          <span
            aria-hidden="true"
            class="relative flex h-7 w-10 overflow-hidden rounded-md ring-1 ring-black/10 dark:ring-white/10"
            :style="{ background: hsl(lookFor(preset).vars['surface-1']) }"
          >
            <span class="m-[3px] ml-[9px] flex flex-1 flex-col gap-[3px] rounded-[3px] p-[3px]" :style="{ background: hsl(lookFor(preset).vars.background) }">
              <span class="h-[3px] w-3/4 rounded-full" :style="{ background: hsl(lookFor(preset).vars.foreground), opacity: 0.85 }" />
              <span class="h-[3px] w-1/2 rounded-full" :style="{ background: hsl(lookFor(preset).vars['muted-foreground']) }" />
              <span class="mt-auto h-[4px] w-1/3 rounded-full" :style="{ background: hsl(lookFor(preset).vars.primary) }" />
            </span>
            <span class="absolute left-[3px] top-[5px] h-[3px] w-[4px] rounded-full" :style="{ background: hsl(lookFor(preset).vars.primary) }" />
            <span class="absolute left-[3px] top-[10px] h-[2px] w-[4px] rounded-full opacity-60" :style="{ background: hsl(lookFor(preset).vars['sidebar-foreground']) }" />
          </span>
          {{ preset.name }}
          <Icon v-if="only(preset)" :name="only(preset) === 'dark' ? 'moon' : 'sun'" :size="12" class="text-faint" />
        </button>
      </div>
    </div>
  </div>
</template>
