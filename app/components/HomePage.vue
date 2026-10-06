<template>
  <main id="main">
    <HeroSection />
    <LazyFeatureShowcase hydrate-never />
    <LazyContactSheet hydrate-never />
    <LazyThemesTeaser hydrate-never />
    <LazyDownloadSection hydrate-on-visible />
    <LazyOpenSource hydrate-on-visible />
    <LazyFaqSection hydrate-never />
    <LazySiteFooter hydrate-on-visible />
  </main>
</template>

<style>
main kbd {
  border-radius: 0.3rem;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  padding: 0.05rem 0.35rem;
  font-size: 0.8em;
}
main li code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
}
</style>
