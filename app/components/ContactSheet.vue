<script setup lang="ts">
/*
 * Everything outside the showcase (app/data/features.ts, tier "more"), as a
 * contact sheet: small crops of real screenshots where a feature has one,
 * then an index of the rest. Static: rendered without hydrating.
 */
import { framedFeatures, indexFeatures, isNew } from "~/data/features";
</script>

<template>
  <section id="more" class="relative cv-auto py-20 sm:py-28" aria-labelledby="more-title">
    <div class="container-x">
      <ul class="sheet">
        <li class="sheet-head">
          <h2 id="more-title" class="display text-[2.4rem] sm:text-[3rem]">Everything else.</h2>
          <p class="mt-4 max-w-[19rem] leading-relaxed text-muted">The details you reach for every day, all in the free app.</p>
        </li>
        <li v-for="feature in framedFeatures" :id="feature.id" :key="feature.id" class="frame">
          <ShotCrop
            class="frame-shot"
            :name="feature.shot!"
            :alt="feature.alt ?? feature.title"
            :crop="feature.crop!"
            sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 75vw"
          />
          <div class="min-w-0">
            <h3 class="font-medium tracking-tight">
              {{ feature.title }}<span v-if="isNew(feature)" class="new">New</span>
            </h3>
            <p class="mt-1 text-[0.875rem] leading-relaxed text-muted">{{ feature.lead }}</p>
          </div>
        </li>
      </ul>

      <ul class="index mt-14 sm:mt-20">
        <li v-for="feature in indexFeatures" :id="feature.id" :key="feature.id">
          <h3 class="font-medium tracking-tight">
            {{ feature.title }}<span v-if="isNew(feature)" class="new">New</span>
          </h3>
          <p class="mt-1 text-[0.875rem] leading-relaxed text-muted">{{ feature.lead }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sheet {
  display: grid;
  gap: 1.75rem;
}
.sheet-head {
  padding-bottom: 0.5rem;
}
.frame {
  display: grid;
  grid-template-columns: 9.5rem minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}
.frame-shot {
  aspect-ratio: 16 / 10;
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--line-strong);
  background: var(--surface);
}
@media (min-width: 640px) {
  .sheet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem 1.5rem;
  }
  .frame {
    display: block;
  }
  .frame-shot {
    margin-bottom: 1rem;
  }
}
@media (min-width: 1024px) {
  .sheet {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.index {
  display: grid;
  gap: 0 1.5rem;
}
.index li {
  border-top: 1px solid var(--line);
  padding: 1.1rem 0 1.4rem;
}
@media (min-width: 640px) {
  .index {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .index {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.new {
  margin-left: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--accent-text);
  vertical-align: 0.1em;
}
</style>
