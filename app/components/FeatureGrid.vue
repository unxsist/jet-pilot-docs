<script setup lang="ts">
/*
 * "Everything else": every feature outside the tour (app/data/features.ts,
 * tier "more") as a compact grid. Static, so it renders without hydrating.
 * The hairline grid reads best with a multiple of four features.
 */
import { isNew, moreFeatures } from "~/data/features";
</script>

<template>
  <section id="more" class="relative cv-auto py-14 sm:py-20" aria-labelledby="more-title">
    <div class="container-x">
      <div data-reveal class="max-w-2xl">
        <span class="eyebrow">Everything else</span>
        <h2 id="more-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-[2.5rem] sm:leading-[1.1]">
          The details you reach for every day.
        </h2>
      </div>

      <ul data-reveal class="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="feature in moreFeatures"
          :id="feature.id"
          :key="feature.id"
          class="relative flex gap-4 bg-bg p-4 transition-colors hover:bg-surface sm:block sm:p-6"
        >
          <span class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent-text">
            <Icon :name="feature.icon" :size="15" />
          </span>
          <div class="min-w-0">
            <h3 class="font-semibold tracking-tight sm:mt-4">
              {{ feature.title }}
              <span v-if="isNew(feature)" class="ml-1.5 inline-block rounded-full border border-accent/30 bg-accent-soft px-2 py-px align-[0.1em] text-[0.68rem] font-semibold text-accent-text sm:absolute sm:right-6 sm:top-6 sm:ml-0 sm:py-0.5">New</span>
            </h3>
            <p class="mt-1 text-[0.88rem] leading-relaxed text-muted sm:mt-1.5">{{ feature.lead }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
