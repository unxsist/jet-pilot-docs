<script setup lang="ts">
/*
 * A real JET Pilot screenshot (2x, macOS) in dark and light. Only the
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

const src = (theme: string, ext: string) =>
  `/images/app/${props.name}-${theme}-1280.${ext} 1280w, /images/app/${props.name}-${theme}-2400.${ext} 2400w`;
</script>

<template>
  <picture class="block dark:hidden">
    <source type="image/avif" :srcset="src('light', 'avif')" :sizes="sizes" />
    <source type="image/webp" :srcset="src('light', 'webp')" :sizes="sizes" />
    <img
      :src="`/images/app/${name}-light-1280.webp`"
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
      :src="`/images/app/${name}-dark-1280.webp`"
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
