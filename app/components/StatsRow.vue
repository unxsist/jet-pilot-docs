<script setup lang="ts">
const stats = [
  { value: "Rust", unit: "+ Tauri 2", label: "A native shell around your system webview — not another bundled browser." },
  { value: "~20", unit: "MB", label: "Typical installer size — .dmg, .exe, .msi, .deb and .rpm." },
  { value: "0", unit: "accounts", label: "No sign-up, no login. It reads the kubeconfig you already have." },
  { value: "0", unit: "telemetry", label: "No analytics or tracking in the app. Your clusters are your business." },
  { value: "MIT", unit: "licensed", label: "Free and open source. Read it, fork it, improve it." },
];
</script>

<template>
  <section class="relative cv-auto py-20 sm:py-28" aria-labelledby="native-title">
    <div class="container-x">
      <div data-reveal class="mx-auto max-w-2xl text-center">
        <span class="eyebrow">Native, fast, private</span>
        <h2 id="native-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
          Small on disk. Quick to start. Quiet on the wire.
        </h2>
      </div>
      <dl class="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-line [gap:1px] sm:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="(stat, i) in stats"
          :key="stat.unit"
          data-reveal
          :style="{ '--reveal-delay': `${i * 70}ms` }"
          class="flex flex-col bg-bg p-6 sm:p-7"
          :class="i === stats.length - 1 ? 'col-span-2 sm:col-span-1' : ''"
        >
          <dt class="order-2 mt-3 text-[0.85rem] leading-relaxed text-muted">{{ stat.label }}</dt>
          <dd class="order-1 flex items-baseline gap-1.5">
            <span class="text-4xl font-semibold tracking-[-0.04em] sm:text-[2.75rem]">{{ stat.value }}</span>
            <span class="font-mono text-[0.78rem] text-faint">{{ stat.unit }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
