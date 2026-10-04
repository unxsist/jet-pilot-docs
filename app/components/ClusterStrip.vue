<script setup lang="ts">
// Text only — no third-party logos.
const clusters = ["Amazon EKS", "Google GKE", "Azure AKS", "k3s", "kind", "minikube", "Rancher", "OpenShift", "DigitalOcean", "Docker Desktop", "MicroK8s", "Talos"];
</script>

<template>
  <section class="relative py-14 sm:py-20" aria-labelledby="clusters-title">
    <div class="container-x">
      <h2 id="clusters-title" class="text-center text-sm text-faint">
        Works with any conformant cluster you can reach with a kubeconfig
      </h2>
      <div class="marquee group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div class="marquee-track flex w-max gap-2.5 group-hover:[animation-play-state:paused]">
          <ul v-for="copy in 2" :key="copy" class="flex shrink-0 gap-2.5" :aria-hidden="copy === 2 ? 'true' : undefined">
            <li
              v-for="name in clusters"
              :key="name"
              class="whitespace-nowrap rounded-full border border-line bg-surface/60 px-4 py-1.5 font-mono text-[0.78rem] text-muted"
            >
              {{ name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee 48s linear infinite;
}
@keyframes marquee {
  to {
    transform: translateX(calc(-50% - 0.3125rem));
  }
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }
  .marquee-track {
    animation: none;
    width: auto;
    justify-content: center;
  }
  .marquee-track ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  .marquee-track ul + ul {
    display: none;
  }
}
</style>
