<script setup lang="ts">
import { REPO_URL } from "~/composables/useGitHub";
import { faqs } from "~/utils/faqs";
</script>

<template>
  <section id="faq" class="relative cv-auto py-20 sm:py-28" aria-labelledby="faq-title">
    <div class="container-x grid gap-12 lg:grid-cols-12">
      <div data-reveal class="lg:col-span-4">
        <span class="eyebrow">FAQ</span>
        <h2 id="faq-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">Questions, answered.</h2>
        <p class="mt-4 leading-relaxed text-muted">
          Something else? Open a
          <a :href="`${REPO_URL}/issues`" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">GitHub issue</a>
          and we’ll take a look.
        </p>
      </div>
      <div class="lg:col-span-8">
        <details
          v-for="(item, i) in faqs"
          :key="item.q"
          :name="'faq'"
          class="group border-b border-line first:border-t"
          :open="i === 1"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.02rem] font-medium tracking-tight transition-colors hover:text-accent-text [&::-webkit-details-marker]:hidden"
          >
            {{ item.q }}
            <span class="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform duration-300 group-open:rotate-180">
              <Icon name="chevronDown" :size="15" />
            </span>
          </summary>
          <div
            class="faq-answer -mt-1 pb-6 pr-12 text-[0.95rem] leading-relaxed text-muted"
            v-html="item.a"
          />
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-answer :deep(code) {
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.1rem 0.35rem;
  font-size: 0.82em;
  color: var(--fg);
  word-break: break-word;
}
.faq-answer :deep(strong) {
  color: var(--fg);
  font-weight: 500;
}
</style>
