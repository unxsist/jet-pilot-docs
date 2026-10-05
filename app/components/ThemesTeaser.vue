<script setup lang="ts">
/*
 * Homepage teaser for custom themes: one card, one screenshot (the theme
 * library, following the site's light / dark mode), and the way to /themes/.
 * Static: no state, so the homepage renders it without hydrating.
 */
const points = [
  "<strong>VS Code</strong>, <strong>Sublime Text</strong> and <strong>TextMate</strong> themes, syntax and terminal colours included",
  "One-click installs from the <strong>Open VSX</strong> gallery",
  "A JSON editor with a live preview — two colours are enough",
];

/*
 * The part of the 1280 × 800 screenshot to show: the settings nav and the
 * theme cards on large screens, the theme cards alone on small ones.
 */
const crop = { x: 300, xSmall: 520, y: 20, width: 870, height: 635 };
const shotStyle = {
  width: `${(1280 / crop.width) * 100}%`,
  "--shot-left": `${(-crop.x / crop.width) * 100}%`,
  "--shot-left-small": `${(-crop.xSmall / crop.width) * 100}%`,
  top: `${(-crop.y / crop.height) * 100}%`,
};
</script>

<template>
  <section id="themes" class="relative cv-auto py-14 sm:py-20" aria-labelledby="themes-teaser-title">
    <div class="container-x">
      <div data-reveal class="teaser-card relative isolate overflow-hidden rounded-[28px] border border-line bg-surface shadow-card">
        <!-- backdrop: a faint grid and one soft accent glow -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
          <div class="teaser-grid absolute inset-0" />
          <div
            class="absolute -left-48 -top-56 size-[40rem] rounded-full opacity-70 dark:opacity-60"
            style="background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent)"
          />
        </div>

        <div class="grid lg:grid-cols-12">
          <div class="relative z-10 px-6 pb-10 pt-8 sm:px-10 sm:pt-11 lg:col-span-5 lg:py-16 lg:pl-14 lg:pr-2">
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
            <p class="mt-4 max-w-md text-[1.02rem] leading-relaxed text-muted">
              Pick one of 14 built-ins or bring the theme you already love. The sidebar, tables, YAML editor and terminal
              all follow — in light and dark.
            </p>
            <ul class="mt-6 space-y-2.5">
              <li v-for="point in points" :key="point" class="flex gap-3 text-[0.93rem] leading-relaxed">
                <span class="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span class="text-fg/85" v-html="point" />
              </li>
            </ul>
            <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="/themes/" class="group inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-4 text-[0.9rem] font-semibold text-bg transition-transform hover:-translate-y-px">
                Preview the themes <Icon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="/themes/#try" class="group inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-muted transition-colors hover:text-fg">
                Try your own theme <Icon name="arrowRight" :size="14" class="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <!-- the theme library, peeking in from the right and bottom edges -->
          <div class="relative h-[17.5rem] sm:h-[25rem] lg:col-span-7 lg:h-auto">
            <div
              class="teaser-shot absolute left-6 top-0 w-[38rem] sm:left-10 sm:w-[54rem] lg:left-2 lg:top-16 lg:w-[118%]"
            >
              <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
                <div class="relative overflow-hidden rounded-[13px] bg-surface" :style="{ aspectRatio: `${crop.width} / ${crop.height}` }">
                  <div class="teaser-crop absolute" :style="shotStyle">
                    <AppShot
                      name="themes-library"
                      alt="JET Pilot's theme library under Settings › Appearance: theme cards with live mini previews for JET, Catppuccin, Tokyo Night, Dracula, Nord, GitHub, One Dark Pro, Rosé Pine and Gruvbox, each with light and dark badges"
                      sizes="(min-width: 1024px) 1240px, (min-width: 640px) 1270px, 900px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.teaser-grid {
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 70% at 15% 20%, #000 10%, transparent 75%);
}
.teaser-crop {
  left: var(--shot-left-small);
}
@media (min-width: 1024px) {
  .teaser-crop {
    left: var(--shot-left);
  }
}
/* A small lift when the card is hovered; nothing moves with reduced motion. */
.teaser-shot {
  transition: transform 0.9s var(--ease-out-expo);
}
.teaser-card:hover .teaser-shot {
  transform: translate(-6px, -6px);
}
@media (prefers-reduced-motion: reduce) {
  .teaser-card:hover .teaser-shot {
    transform: none;
  }
}
</style>
