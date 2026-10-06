<script setup lang="ts">
/*
 * A real JET Pilot screenshot (macOS; 1280, 2400 and 3600 px wide) in dark and light. Only the
 * variant matching the active theme is displayed; the hidden one is lazy
 * so it is never fetched. `priority` is for the hero (LCP) image.
 */
const props = withDefaults(
  defineProps<{
    name: string;
    alt: string;
    sizes?: string;
    priority?: boolean;
    imgClass?: string;
  }>(),
  { sizes: "(min-width: 1280px) 1200px, 94vw", priority: false, imgClass: "" }
);

const asset = useAsset();
const src = (theme: string, ext: string) =>
  [1280, 2400, 3600].map((w) => `${asset(`images/app/${props.name}-${theme}-${w}.${ext}`)} ${w}w`).join(", ");
</script>

<template>
  <picture class="block dark:hidden">
    <source type="image/avif" :srcset="src('light', 'avif')" :sizes="sizes" />
    <source type="image/webp" :srcset="src('light', 'webp')" :sizes="sizes" />
    <img
      :src="asset(`images/app/${name}-light-1280.webp`)"
      :alt="alt"
      width="1440"
      height="900"
      loading="lazy"
      decoding="async"
      :class="['block h-auto w-full', imgClass]"
    />
  </picture>
  <picture class="hidden dark:block">
    <source type="image/avif" :srcset="src('dark', 'avif')" :sizes="sizes" />
    <source type="image/webp" :srcset="src('dark', 'webp')" :sizes="sizes" />
    <img
      :src="asset(`images/app/${name}-dark-1280.webp`)"
      :alt="alt"
      width="1440"
      height="900"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      :class="['block h-auto w-full', imgClass]"
    />
  </picture>
</template>
