<script setup lang="ts">
const split = ref(52);
const sizes = "(min-width: 1280px) 1100px, 94vw";
const srcset = (theme: string, ext: string) =>
  `/images/app/side-panel-${theme}-1280.${ext} 1280w, /images/app/side-panel-${theme}-2400.${ext} 2400w`;
</script>

<template>
  <section class="relative cv-auto py-16 sm:py-24" aria-labelledby="look-title">
    <div class="container-x">
      <div data-reveal class="mx-auto max-w-2xl text-center">
        <div class="flex items-center justify-center gap-2.5">
          <span class="eyebrow">A whole new look</span>
          <span class="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[0.68rem] font-semibold text-accent-text">New</span>
        </div>
        <h3 id="look-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-[2.5rem] sm:leading-[1.1]">
          Redesigned from the first pixel to the last.
        </h3>
        <p class="mt-4 text-[1.02rem] leading-relaxed text-muted">
          A new design system with Inter and JetBrains Mono, hairline borders, calm surfaces and status colours that
          mean something. Dark and light are both first-class — drag to compare.
        </p>
      </div>

      <div data-reveal style="--reveal-delay: 120ms" class="relative mx-auto mt-12 max-w-[68rem]">
        <div class="rounded-[14px] p-px shadow-float" style="background: linear-gradient(180deg, var(--line-strong), var(--line))">
          <div class="relative overflow-hidden rounded-[13px] bg-surface select-none">
            <picture>
              <source type="image/avif" :srcset="srcset('light', 'avif')" :sizes="sizes" />
              <source type="image/webp" :srcset="srcset('light', 'webp')" :sizes="sizes" />
              <img src="/images/app/side-panel-light-1280.webp" alt="JET Pilot in the light theme: pods table with the side panel open on a crash-looping pod" width="1440" height="900" loading="lazy" decoding="async" class="block h-auto w-full" />
            </picture>
            <div class="absolute inset-0" :style="{ clipPath: `inset(0 ${100 - split}% 0 0)` }">
              <picture>
                <source type="image/avif" :srcset="srcset('dark', 'avif')" :sizes="sizes" />
                <source type="image/webp" :srcset="srcset('dark', 'webp')" :sizes="sizes" />
                <img src="/images/app/side-panel-dark-1280.webp" alt="The same screen in the dark theme" width="1440" height="900" loading="lazy" decoding="async" class="block h-auto w-full" />
              </picture>
            </div>
            <!-- divider -->
            <div class="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" :style="{ left: `${split}%` }">
              <div class="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-700 shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18-6-6 6-6M15 6l6 6-6 6" /></svg>
              </div>
            </div>
            <span class="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur" :style="{ opacity: split > 12 ? 1 : 0 }">Dark</span>
            <span class="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/80 px-2.5 py-1 text-[0.7rem] font-medium text-zinc-800 ring-1 ring-black/10 backdrop-blur" :style="{ opacity: split < 88 ? 1 : 0 }">Light</span>
            <input
              v-model.number="split"
              type="range"
              min="0"
              max="100"
              step="0.5"
              aria-label="Compare the dark and light themes"
              class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
