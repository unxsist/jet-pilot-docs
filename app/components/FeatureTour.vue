<script setup lang="ts">
/*
 * The feature tour: one app window and the showcased features beside it
 * (app/data/features.ts, tier "tour"). The active feature's screenshot
 * crossfades in. It moves on every 6 s, with a progress bar on the active
 * item, while the tour is on screen; hovering or focusing it pauses, and with
 * prefers-reduced-motion it never moves by itself. A screenshot loads when its
 * feature is shown, plus the next one once the current one is in.
 */
import { isNew, tourFeatures as items } from "~/data/features";

const DURATION_MS = 6000;
const FADE_MS = 600;

const root = ref<HTMLElement | null>(null);
const tabs: HTMLButtonElement[] = [];
const shots: HTMLElement[] = [];

/** The selected tab. */
const active = ref(0);
/** The screenshot on top, and the one it fades in over. */
const shown = ref(0);
const under = ref<number | null>(null);
/** Screenshots in the DOM (they load lazily), and the ones that have loaded. */
const mounted = reactive(new Set<number>([0]));
const ready = reactive(new Set<number>());
/** Restarts the progress bar. */
const cycle = ref(0);

const reduced = ref(true);
const inView = ref(false);
const hovering = ref(false);
const focused = ref(false);
const pageHidden = ref(false);
const running = computed(() => !reduced.value && inView.value && !hovering.value && !focused.value && !pageHidden.value);

let fadeTimer: ReturnType<typeof setTimeout> | undefined;
const show = (index: number) => {
  if (index === shown.value) return;
  clearTimeout(fadeTimer);
  under.value = shown.value;
  shown.value = index;
  fadeTimer = setTimeout(() => (under.value = null), reduced.value ? 0 : FADE_MS);
};

const loadedIn = (index: number) => {
  const el = shots[index];
  return !!el && [...el.querySelectorAll("img")].some((img) => img.offsetParent !== null && img.complete && img.naturalWidth > 0);
};

const onLoad = (index: number) => {
  ready.add(index);
  if (index === active.value) {
    show(index);
    mounted.add((index + 1) % items.length);
  }
};

const select = (index: number, { focus = false } = {}) => {
  const next = (index + items.length) % items.length;
  active.value = next;
  cycle.value++;
  mounted.add(next);
  if (ready.has(next)) show(next);
  else nextTick(() => loadedIn(next) && onLoad(next));
  if (focus) nextTick(() => tabs[next]?.focus());
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  const moves: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 };
  if (!(event.key in moves)) return;
  event.preventDefault();
  select(moves[event.key]!, { focus: true });
};

const onFocusOut = (event: FocusEvent) => {
  focused.value = !!root.value?.contains(event.relatedTarget as Node | null);
};

const zoomStyle = (zoom = 1, focus = "50% 50%") => (zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: focus } : undefined);

onMounted(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduced.value = motion.matches;
  motion.addEventListener("change", (e) => (reduced.value = e.matches));

  const observer = new IntersectionObserver(([entry]) => (inView.value = !!entry?.isIntersecting), { threshold: 0.35 });
  if (root.value) observer.observe(root.value);
  const onVisibility = () => (pageHidden.value = document.hidden);
  document.addEventListener("visibilitychange", onVisibility);

  // The first screenshot may have loaded before this hydrated.
  if (loadedIn(0)) onLoad(0);

  // /#graph and the like select that feature.
  const fromHash = () => {
    const index = items.findIndex((f) => `#${f.id}` === location.hash);
    if (index >= 0) select(index);
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);

  onBeforeUnmount(() => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("hashchange", fromHash);
    clearTimeout(fadeTimer);
  });
});
</script>

<template>
  <section
    id="features"
    ref="root"
    class="relative py-14 sm:py-20"
    aria-labelledby="tour-title"
    @focusin="focused = true"
    @focusout="onFocusOut"
  >
    <div class="container-x">
      <div data-reveal class="mx-auto max-w-4xl text-center">
        <span class="eyebrow">Features</span>
        <h2 id="tour-title" class="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl sm:leading-[1.02]">
          <span class="text-shine">The power of kubectl. Without the squinting.</span>
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
          JET Pilot keeps the power of the command line and adds the overview you can’t get from it, across every
          cluster and cloud you work with, updated live.
        </p>
      </div>

      <div
        class="mt-12 grid items-start gap-6 sm:mt-16 lg:grid-cols-12 lg:gap-10"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <!-- the features -->
        <div
          role="tablist"
          aria-label="Features"
          aria-orientation="vertical"
          class="order-2 grid gap-1 sm:grid-cols-2 lg:order-1 lg:col-span-4 lg:grid-cols-1"
        >
          <button
            v-for="(item, i) in items"
            :id="item.id"
            :key="item.id"
            :ref="(el) => (tabs[i] = el as HTMLButtonElement)"
            type="button"
            role="tab"
            :aria-selected="i === active"
            aria-controls="tour-panel"
            :tabindex="i === active ? 0 : -1"
            class="tour-tab group relative flex gap-3.5 rounded-xl py-3 pl-4 pr-3 text-left transition-colors"
            :class="i === active ? 'bg-surface-2/80' : 'hover:bg-surface-2/50'"
            @click="select(i)"
            @keydown="onKeydown($event, i)"
          >
            <!-- the rail, filling up while the tour waits on this feature -->
            <span aria-hidden="true" class="absolute inset-y-3 left-0 w-0.5 overflow-hidden rounded-full bg-line-strong">
              <span
                v-if="i === active && !reduced"
                :key="cycle"
                class="tour-progress absolute inset-x-0 top-0 block bg-accent"
                :style="{ animationDuration: `${DURATION_MS}ms`, animationPlayState: running ? 'running' : 'paused' }"
                @animationend="select(active + 1)"
              />
              <span v-else-if="i === active" class="absolute inset-0 block bg-accent" />
            </span>
            <span
              class="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 transition-colors"
              :class="i === active ? 'text-accent-text' : 'text-faint group-hover:text-muted'"
            >
              <Icon :name="item.icon" :size="15" />
            </span>
            <span class="min-w-0">
              <span class="flex items-center gap-2">
                <span class="font-semibold tracking-tight transition-colors" :class="i === active ? 'text-fg' : 'text-fg/75 group-hover:text-fg'">{{ item.title }}</span>
                <span v-if="isNew(item)" class="rounded-full border border-accent/30 bg-accent-soft px-1.5 py-px text-[0.65rem] font-semibold text-accent-text">New</span>
              </span>
              <span class="mt-0.5 block text-[0.86rem] leading-relaxed text-muted">{{ item.lead }}</span>
            </span>
          </button>
        </div>

        <!-- the app window -->
        <div id="tour-panel" role="tabpanel" :aria-labelledby="items[active]?.id" class="relative order-1 lg:order-2 lg:col-span-8">
          <div
            aria-hidden="true"
            class="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-40 dark:opacity-30"
            style="background: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)"
          />
          <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
            <div class="relative aspect-[1440/900] overflow-hidden rounded-[13px] bg-surface">
              <div
                v-for="(item, i) in items"
                :key="item.id"
                :ref="(el) => (shots[i] = el as HTMLElement)"
                class="absolute inset-0"
                :class="[
                  i === shown ? 'z-10 opacity-100' : i === under ? 'z-0 opacity-100' : 'z-0 opacity-0',
                  i === shown && under !== null ? 'tour-fade' : '',
                ]"
                :aria-hidden="i !== active"
                @load.capture="onLoad(i)"
              >
                <div v-if="mounted.has(i)" class="h-full w-full" :style="zoomStyle(item.zoom, item.focus)">
                  <AppShot :name="item.shot!" :alt="item.alt ?? item.title" sizes="(min-width: 1024px) 1100px, 100vw" />
                </div>
              </div>
            </div>
          </div>
          <!-- a few facts about the feature on show; every set takes the same space -->
          <div class="mt-5 grid px-1">
            <ul
              v-for="(item, i) in items"
              :key="item.id"
              class="flex flex-wrap content-start gap-x-5 gap-y-1.5 text-[0.86rem] text-muted transition-opacity duration-300 [grid-area:1/1]"
              :class="i === active ? 'opacity-100' : 'invisible opacity-0'"
              :aria-hidden="i !== active"
            >
              <li v-for="point in item.points ?? []" :key="point" class="flex items-center gap-2">
                <Icon name="check" :size="14" class="shrink-0 text-accent-text" />
                <span v-html="point" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tour-progress {
  height: 100%;
  transform-origin: top;
  animation-name: tour-progress;
  animation-timing-function: linear;
  animation-fill-mode: both;
}
@keyframes tour-progress {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
.tour-fade {
  animation: tour-fade 0.6s var(--ease-out-expo) both;
}
@keyframes tour-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tour-fade {
    animation: none;
  }
}
.tour-tab :deep(kbd),
#tour-panel :deep(kbd) {
  border-radius: 0.3rem;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  padding: 0.02rem 0.32rem;
  font-size: 0.8em;
}
#tour-panel :deep(code) {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
}
</style>
