<script setup lang="ts">
/*
 * The showcase: one full-width moment per feature (app/data/features.ts,
 * tier "showcase", at most six). A macro is a close-up of the screenshot from
 * edge to edge with the words on its open side; a `wide` feature pulls back
 * to the whole window. Static: rendered without hydrating.
 */
import { isNew, currentMajor, showcaseFeatures } from "~/data/features";

/* Macros alternate sides unless a feature says otherwise. */
const items = (() => {
  let macros = 0;
  return showcaseFeatures.map((feature) => {
    const side = feature.wide ? null : (feature.side ?? (macros++ % 2 === 0 ? "left" : "right"));
    return { feature, side, isNew: isNew(feature) };
  });
})();

/* Where the focus point goes: in the open part of the frame, beside the words. */
const anchor = (side: string | null): [number, number] => (side === "left" ? [0.66, 0.5] : side === "right" ? [0.34, 0.5] : [0.5, 0.5]);

const macroSizes = (zoom: number, mobileZoom: number) =>
  `(min-width: 768px) ${Math.round(zoom * 100)}vw, ${Math.round(mobileZoom * 100)}vw`;
</script>

<template>
  <section id="features" class="showcase" aria-label="Features">
    <template v-for="{ feature, side, isNew: fresh } in items" :key="feature.id">
      <!-- a close-up -->
      <article v-if="side" :id="feature.id" class="macro" :class="`macro-${side}`" :aria-labelledby="`${feature.id}-title`">
        <div class="macro-band">
          <ShotCrop
            class="absolute inset-0"
            :name="feature.shot!"
            :alt="feature.alt ?? feature.title"
            :crop="feature.crop!"
            :mobile="feature.crop!.mobile"
            :anchor="anchor(side)"
            :sizes="macroSizes(feature.crop!.zoom, feature.crop!.mobile?.zoom ?? feature.crop!.zoom)"
            drift
          />
          <div class="macro-dof" aria-hidden="true" />
          <div class="macro-fade" aria-hidden="true" />
        </div>
        <div class="macro-words">
          <div class="container-x">
            <div class="macro-copy">
              <p v-if="fresh" class="new-tag">New in {{ currentMajor }}.0</p>
              <h2 :id="`${feature.id}-title`" class="display text-[2.6rem] sm:text-[4rem] lg:text-[4.75rem]">{{ feature.title }}</h2>
              <p class="mt-5 max-w-[27rem] text-[1.06rem] leading-relaxed text-muted sm:text-[1.125rem]">{{ feature.lead }}</p>
              <ul class="facts mt-7">
                <li v-for="point in feature.points ?? []" :key="point" v-html="point" />
              </ul>
            </div>
          </div>
        </div>
      </article>

      <!-- pulled back: the whole window -->
      <article v-else :id="feature.id" class="wide" :aria-labelledby="`${feature.id}-title`">
        <div class="container-x">
          <div class="grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-7">
              <p v-if="fresh" class="new-tag">New in {{ currentMajor }}.0</p>
              <h2 :id="`${feature.id}-title`" class="display text-[2.6rem] sm:text-[4rem] lg:text-[4.75rem]">{{ feature.title }}</h2>
            </div>
            <div class="lg:col-span-5 lg:pb-2">
              <p class="max-w-[27rem] text-[1.06rem] leading-relaxed text-muted sm:text-[1.125rem]">{{ feature.lead }}</p>
            </div>
          </div>
        </div>
        <div class="wide-frame">
          <ShotCrop
            class="wide-crop"
            :name="feature.shot!"
            :alt="feature.alt ?? feature.title"
            :crop="{ zoom: 1, focus: [0.5, 0.5] }"
            :mobile="feature.crop!.mobile ?? feature.crop!"
            sizes="(min-width: 1440px) 1360px, (min-width: 768px) 96vw, 250vw"
          />
        </div>
        <div class="container-x">
          <ul class="facts facts-row mt-6">
            <li v-for="point in feature.points ?? []" :key="point" v-html="point" />
          </ul>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
.showcase {
  display: grid;
  gap: clamp(5rem, 11vw, 10rem);
  padding-block: clamp(4rem, 8vw, 8rem) clamp(3rem, 6vw, 6rem);
}

/* ------------------------------------------------------------- macro -- */

.macro {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;
}
.macro-band {
  position: relative;
  height: min(125vw, 34rem);
  background: var(--plate);
  border-block: 1px solid var(--plate-line);
}
.macro-band > :first-child {
  position: absolute;
  inset: 0;
}
/* Shallow depth of field: sharp around the focus point, soft towards the edges. */
.macro-dof {
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  mask-image: radial-gradient(ellipse 60% 52% at 50% 50%, transparent 55%, #000 100%);
}
.macro-left .macro-dof {
  mask-image: radial-gradient(ellipse 34% 52% at 66% 50%, transparent 60%, #000 100%);
}
.macro-right .macro-dof {
  mask-image: radial-gradient(ellipse 34% 52% at 34% 50%, transparent 60%, #000 100%);
}

/* The picture dissolves into the page: top and bottom here, plus the words' side on wide screens. */
.macro-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--plate), transparent 16%, transparent 84%, var(--plate));
}

@media (min-width: 768px) {
  .macro {
    display: block;
  }
  .macro-band {
    height: clamp(34rem, 84svh, 52rem);
  }
  .macro-fade {
    background:
      linear-gradient(var(--fade-dir), var(--plate) 0%, var(--plate) 38%, color-mix(in srgb, var(--plate) 65%, transparent) 48%, transparent 62%),
      linear-gradient(to bottom, var(--plate), transparent 13%, transparent 85%, var(--plate));
  }
  .macro-left .macro-fade {
    --fade-dir: to right;
  }
  .macro-right .macro-fade {
    --fade-dir: to left;
  }
  .macro-words {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .macro-copy {
    pointer-events: auto;
    max-width: 30rem;
  }
  .macro-right .macro-copy {
    margin-left: auto;
  }
}

/* -------------------------------------------------------------- wide -- */

.wide-frame {
  margin-top: 2.5rem;
  margin-left: 1.25rem;
  overflow: clip;
  border-radius: 14px 0 0 14px;
  box-shadow:
    0 0 0 1px var(--line-strong),
    var(--shadow-float);
}
.wide-crop {
  height: 125vw;
}
@media (min-width: 768px) {
  .wide-frame {
    width: min(100% - 4rem, 85rem);
    margin: 3.5rem auto 0;
    border-radius: 18px;
  }
  .wide-crop {
    height: auto;
    aspect-ratio: 1440 / 900;
  }
}

.new-tag {
  margin-bottom: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-text);
}

/* ------------------------------------------------------------- facts -- */

.facts {
  display: grid;
  max-width: 27rem;
  font-size: 0.875rem;
  color: var(--muted);
}
.facts li {
  border-top: 1px solid var(--line);
  padding-block: 0.6rem;
}
.facts li:last-child {
  border-bottom: 1px solid var(--line);
}
@media (min-width: 768px) {
  .facts-row {
    max-width: none;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    column-gap: 2rem;
  }
  .facts-row li:last-child {
    border-bottom: 0;
  }
}
.facts :deep(kbd) {
  border-radius: 0.3rem;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  padding: 0.02rem 0.32rem;
  font-size: 0.8em;
}
</style>
