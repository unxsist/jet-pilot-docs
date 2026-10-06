<script setup lang="ts">
/*
 * A close-up of a screenshot: the AppShot at `zoom` times the frame's width,
 * moved so its `focus` point lands on `anchor` (fractions of the frame), and
 * clamped so the frame never shows past the screenshot's edge. All CSS
 * (container query units), so it holds at any frame size without JavaScript.
 * The frame (this element) needs a definite width and height from its parent.
 * Below 768 px (1024 px with `wideFrom="lg"`) the `mobile` crop and anchor apply.
 * The screenshot is `zoom` times the frame's width: cap the frame (not the
 * zoom) so the sources are never stretched; the widest close-ups draw a
 * Retina detail (app/data/details.ts) instead of the full screenshot.
 */
import type { Crop } from "~/data/features";
import { details } from "~/data/details";

const props = withDefaults(
  defineProps<{
    name: string;
    alt: string;
    crop: Crop;
    mobile?: Crop;
    /** With `wideFrom="lg"`: the crop for 768–1023 px (defaults to `mobile`). */
    tablet?: Crop;
    anchor?: [number, number];
    mobileAnchor?: [number, number];
    sizes: string;
    /** Slow scroll-linked drift towards the focus point (never with reduced motion). */
    drift?: boolean;
    /** Where the wide-screen crop takes over. */
    wideFrom?: "md" | "lg";
  }>(),
  { anchor: () => [0.5, 0.5], mobileAnchor: () => [0.5, 0.5], drift: false, mobile: undefined, tablet: undefined, wideFrom: "md" }
);

/* A Retina detail of this shot, when there is one (app/data/details.ts). */
const detail = computed(() => details[props.name]);

const style = computed(() => {
  const m = props.mobile ?? props.crop;
  const t = props.tablet ?? m;
  return {
    "--tz": t.zoom,
    "--tfx": t.focus[0],
    "--tfy": t.focus[1],
    "--z": props.crop.zoom,
    "--fx": props.crop.focus[0],
    "--fy": props.crop.focus[1],
    "--ax": props.anchor[0],
    "--ay": props.anchor[1],
    "--mz": m.zoom,
    "--mfx": m.focus[0],
    "--mfy": m.focus[1],
    "--max": props.mobileAnchor[0],
    "--may": props.mobileAnchor[1],
  };
});
</script>

<template>
  <div class="shot-crop" :class="`from-${wideFrom}`" :style="style">
    <div class="shot-crop-img" :class="{ 'shot-crop-drift': drift }">
      <DetailShot v-if="detail" :name="name" :alt="alt" :detail="detail" />
      <AppShot v-else :name="name" :alt="alt" :sizes="sizes" />
    </div>
  </div>
</template>

<style scoped>
/*
 * --crop-ax / --crop-ay, when an ancestor sets them, move the focus point
 * elsewhere (custom properties inherit), e.g. lower in the frame on tablets.
 */
.shot-crop {
  --zoom: var(--mz);
  --focus-x: var(--mfx);
  --focus-y: var(--mfy);
  --anchor-x: var(--crop-ax, var(--max));
  --anchor-y: var(--crop-ay, var(--may));
  overflow: clip;
  container-type: size;
  view-timeline: --shot-crop block;
}
/* Layered, so a parent's position utility (absolute inset-0) wins. */
@layer components {
  .shot-crop {
    position: relative;
  }
}
@media (min-width: 768px) {
  .shot-crop.from-md {
    --zoom: var(--z);
    --focus-x: var(--fx);
    --focus-y: var(--fy);
    --anchor-x: var(--crop-ax, var(--ax));
    --anchor-y: var(--crop-ay, var(--ay));
  }
}
@media (min-width: 768px) {
  .shot-crop.from-lg {
    --zoom: var(--tz);
    --focus-x: var(--tfx);
    --focus-y: var(--tfy);
  }
}
@media (min-width: 1024px) {
  .shot-crop.from-lg {
    --zoom: var(--z);
    --focus-x: var(--fx);
    --focus-y: var(--fy);
    --anchor-x: var(--crop-ax, var(--ax));
    --anchor-y: var(--crop-ay, var(--ay));
  }
}
.shot-crop-img {
  --w: calc(var(--zoom) * 100cqw);
  --h: calc(var(--w) * 0.625);
  position: absolute;
  width: var(--w);
  aspect-ratio: 1440 / 900;
  left: clamp(calc(100cqw - var(--w)), calc(var(--anchor-x) * 100cqw - var(--focus-x) * var(--w)), 0px);
  top: clamp(calc(100cqh - var(--h)), calc(var(--anchor-y) * 100cqh - var(--focus-y) * var(--h)), 0px);
  transform-origin: calc(var(--focus-x) * 100%) calc(var(--focus-y) * 100%);
}

/*
 * A slow push in towards the focus point while the frame comes up to the
 * middle of the viewport, then it holds. It ends at the resting crop (scale 1),
 * so the motion never enlarges the screenshot past its static size; the
 * frame's edge masks cover the few pixels the smaller start leaves open.
 * Transform only (compositor); static without support or with reduced motion.
 */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .shot-crop-drift {
      animation: shot-drift linear both;
      animation-timeline: --shot-crop;
      animation-range: cover 0% cover 50%;
    }
  }
}
@keyframes shot-drift {
  from {
    transform: scale(0.93);
  }
  to {
    transform: scale(1);
  }
}
</style>
