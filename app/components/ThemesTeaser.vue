<script setup lang="ts">
/*
 * Homepage teaser for themes: the theme library from edge to edge, close up,
 * and the way to /themes/. Static: rendered without hydrating.
 */
const points = [
  "Bring the theme you use in your editor, syntax and terminal colours included",
  "One-click installs from an open theme gallery",
  "A JSON editor with a live preview: two colours are enough",
];
</script>

<template>
  <section id="themes" class="relative cv-auto pt-16 sm:pt-24" aria-labelledby="themes-teaser-title">
    <div class="container-x">
      <div class="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
        <h2 id="themes-teaser-title" class="display text-[2.6rem] sm:text-[4rem] lg:col-span-7 lg:text-[4.75rem]">
          Your colours.<br />Every pixel.
        </h2>
        <div class="lg:col-span-5 lg:pb-2">
          <p class="max-w-[27rem] text-[1.06rem] leading-relaxed text-muted sm:text-[1.125rem]">
            Pick one of 14 built-ins or bring your own. The sidebar, tables, YAML editor and terminal all follow, in
            light and dark.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="/themes/" class="group inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-[0.9rem] font-semibold text-bg transition-opacity hover:opacity-90">
              Preview the themes <Icon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="/themes/#try" class="group inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-muted transition-colors hover:text-fg">
              Try your own theme <Icon name="arrowRight" :size="14" class="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="themes-band mt-10 sm:mt-14">
      <ShotCrop
        class="absolute inset-0"
        name="themes-library"
        alt="JET Pilot's theme library under Settings › Appearance: built-in themes as cards, each with a live miniature of the app in its colours"
        :crop="{ zoom: 1.75, focus: [0.66, 0.42] }"
        :mobile="{ zoom: 2.6, focus: [0.66, 0.3] }"
        sizes="(min-width: 768px) 175vw, 260vw"
        drift
      />
      <div class="themes-fade" aria-hidden="true" />
    </div>

    <div class="container-x">
      <ul class="themes-points">
        <li v-for="point in points" :key="point">{{ point }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.themes-band {
  position: relative;
  height: min(120vw, 32rem);
  background: var(--plate);
  border-block: 1px solid var(--plate-line);
}
.themes-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--plate), transparent 14%, transparent 80%, var(--plate));
}
@media (min-width: 768px) {
  .themes-band {
    height: clamp(30rem, 72svh, 46rem);
  }
  .themes-fade {
    background:
      linear-gradient(to right, var(--plate), transparent 12%, transparent 88%, var(--plate)),
      linear-gradient(to bottom, var(--plate), transparent 14%, transparent 80%, var(--plate));
  }
}
.themes-points {
  display: grid;
  font-size: 0.875rem;
  color: var(--muted);
}
.themes-points li {
  border-top: 1px solid var(--line);
  padding-block: 0.6rem;
}
@media (min-width: 768px) {
  .themes-points {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 2rem;
  }
}
</style>
