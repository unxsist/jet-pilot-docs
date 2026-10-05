<script setup lang="ts">
/* What sets JET Pilot apart, in four lines. Static. */
const reasons = [
  { icon: "cloud", title: "Every cloud, built in", text: "Sign in to AWS, Google Cloud, Azure and six more right in the app." },
  { icon: "heart", title: "Free for good", text: "No account, no telemetry, MIT licensed." },
  { icon: "shield", title: "Safe by default", text: "Your kubeconfig untouched, credentials in your keychain, guardrails for production." },
  { icon: "zap", title: "Calm and fast", text: "Live data straight from the API server, in a native app of about 20 MB." },
];
</script>

<template>
  <section class="relative py-10 sm:py-14" aria-labelledby="why-title">
    <div class="container-x">
      <h2 id="why-title" class="eyebrow text-center">Why JET Pilot</h2>
      <ul class="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
        <li
          v-for="(reason, i) in reasons"
          :key="reason.title"
          data-reveal
          :style="{ '--reveal-delay': `${i * 70}ms` }"
          class="flex gap-4 lg:border-l lg:border-line lg:px-7 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
        >
          <span class="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-text shadow-card">
            <Icon :name="reason.icon" :size="17" />
          </span>
          <div>
            <h3 class="font-semibold tracking-tight">{{ reason.title }}</h3>
            <p class="mt-1 text-[0.9rem] leading-relaxed text-muted">{{ reason.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
