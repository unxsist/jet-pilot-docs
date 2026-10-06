<script setup lang="ts">
/*
 * The Retina detail of a screenshot (app/data/details.ts), placed where it
 * sits in the full window: its parent is the window, sized like AppShot.
 * Dark and light like AppShot; the hidden one is never fetched.
 */
import { detailWidths, type Detail } from "~/data/details";

const props = defineProps<{ name: string; alt: string; detail: Detail }>();

const asset = useAsset();
const widths = computed(() => detailWidths(props.detail));
const src = (theme: string, ext: string) =>
  widths.value.map((w) => `${asset(`images/app/detail/${props.name}-${theme}-${w}.${ext}`)} ${w}w`).join(", ");
const box = computed(() => {
  const [x0, y0, x1, y1] = props.detail.box;
  return { left: `${x0 * 100}%`, top: `${y0 * 100}%`, width: `${(x1 - x0) * 100}%`, height: `${(y1 - y0) * 100}%` };
});
</script>

<template>
  <div class="absolute" :style="box">
    <picture class="block h-full dark:hidden">
      <source type="image/avif" :srcset="src('light', 'avif')" :sizes="detail.sizes" />
      <source type="image/webp" :srcset="src('light', 'webp')" :sizes="detail.sizes" />
      <img :src="asset(`images/app/detail/${name}-light-${widths[0]}.webp`)" :alt="alt" loading="lazy" decoding="async" class="block size-full" />
    </picture>
    <picture class="hidden h-full dark:block">
      <source type="image/avif" :srcset="src('dark', 'avif')" :sizes="detail.sizes" />
      <source type="image/webp" :srcset="src('dark', 'webp')" :sizes="detail.sizes" />
      <img :src="asset(`images/app/detail/${name}-dark-${widths[0]}.webp`)" :alt="alt" loading="lazy" decoding="async" class="block size-full" />
    </picture>
  </div>
</template>
