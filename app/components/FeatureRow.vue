<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    eyebrow: string;
    icon: string;
    title: string;
    lead: string;
    points?: string[];
    shot: string;
    alt: string;
    reverse?: boolean;
    badge?: string;
    /** Crop into the screenshot: scale factor and transform-origin. */
    zoom?: number;
    focus?: string;
  }>(),
  { points: () => [], reverse: false, zoom: 1, focus: "50% 50%" }
);
</script>

<template>
  <section :id="id" class="relative cv-auto py-14 sm:py-20" :aria-labelledby="`${id ?? shot}-title`">
    <div class="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div data-reveal class="lg:col-span-4" :class="reverse ? 'lg:order-2' : ''">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex size-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent-text shadow-card">
            <Icon :name="icon" :size="16" />
          </span>
          <span class="eyebrow">{{ eyebrow }}</span>
          <span v-if="badge" class="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[0.68rem] font-semibold text-accent-text">{{ badge }}</span>
        </div>
        <h3 :id="`${id ?? shot}-title`" class="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]">
          {{ title }}
        </h3>
        <p class="mt-4 text-[1.02rem] leading-relaxed text-muted">{{ lead }}</p>
        <ul v-if="points.length" class="mt-6 space-y-3">
          <li v-for="point in points" :key="point" class="flex gap-3 text-[0.95rem] leading-relaxed">
            <span class="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span class="text-fg/85" v-html="point" />
          </li>
        </ul>
        <slot name="extra" />
      </div>

      <div data-reveal style="--reveal-delay: 120ms" class="relative lg:col-span-8" :class="reverse ? 'lg:order-1' : ''">
        <div
          aria-hidden="true"
          class="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-40 dark:opacity-30"
          style="background: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)"
        />
        <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
          <div class="overflow-hidden rounded-[13px] bg-surface">
            <div :style="zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: focus } : undefined">
              <AppShot :name="shot" :alt="alt" :sizes="zoom > 1.2 ? '(min-width: 1024px) 1100px, 100vw' : '(min-width: 1280px) 800px, (min-width: 1024px) 64vw, 94vw'" />
            </div>
          </div>
        </div>
        <slot name="overlay" />
      </div>
    </div>
  </section>
</template>
