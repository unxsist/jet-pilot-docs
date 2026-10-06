<script setup lang="ts">
/*
 * A close-up of a screenshot: the AppShot at `zoom` times the frame's width,
 * moved so its `focus` point lands on `anchor` (fractions of the frame), and
 * clamped so the frame never shows past the screenshot's edge. All CSS
 * (container query units), so it holds at any frame size without JavaScript.
 * The frame (this element) needs a definite width and height from its parent.
 * Below 768 px (1024 px with `wideFrom="lg"`) the `mobile` crop and anchor apply.
 */
import type { Crop } from "~/data/features";

const props = withDefaults(
  defineProps<{
    name: string;
    alt: string;
    crop: Crop;
    mobile?: Crop;
    anchor?: [number, number];
    mobileAnchor?: [number, number];
    sizes: string;
    /** Slow scroll-linked drift towards the focus point (never with reduced motion). */
    drift?: boolean;
    /** Where the wide-screen crop takes over. */
    wideFrom?: "md" | "lg";
  }>(),
  { anchor: () => [0.5, 0.5], mobileAnchor: () => [0.5, 0.5], drift: false, mobile: undefined, wideFrom: "md" }
);

const style = computed(() => {
  const m = props.mobile ?? props.crop;
  return {
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
      <AppShot :name="name" :alt="alt" :sizes="sizes" />
    </div>
  </div>
</template>

<style scoped>
.shot-crop {
  --zoom: var(--mz);
  --focus-x: var(--mfx);
  --focus-y: var(--mfy);
  --anchor-x: var(--max);
  --anchor-y: var(--may);
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
    --anchor-x: var(--ax);
    --anchor-y: var(--ay);
  }
}
@media (min-width: 1024px) {
  .shot-crop.from-lg {
    --zoom: var(--z);
    --focus-x: var(--fx);
    --focus-y: var(--fy);
    --anchor-x: var(--ax);
    --anchor-y: var(--ay);
  }
}
.shot-crop-img {
  /* Past 1600 px the close-up stops growing, so the 2400 px source stays sharp. */
  --w: calc(var(--zoom) * min(100cqw, 1600px));
  --h: calc(var(--w) * 0.625);
  position: absolute;
  width: var(--w);
  left: clamp(calc(100cqw - var(--w)), calc(var(--anchor-x) * 100cqw - var(--focus-x) * var(--w)), 0px);
  top: clamp(calc(100cqh - var(--h)), calc(var(--anchor-y) * 100cqh - var(--focus-y) * var(--h)), 0px);
  transform-origin: calc(var(--focus-x) * 100%) calc(var(--focus-y) * 100%);
}

/* A slow push in as the frame crosses the viewport; static without support or with reduced motion. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .shot-crop-drift {
      animation: shot-drift linear both;
      animation-timeline: --shot-crop;
      animation-range: cover 0% cover 100%;
    }
  }
}
@keyframes shot-drift {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}
</style>
