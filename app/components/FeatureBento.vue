<script setup lang="ts">
const pods = [
  { name: "payments-api-7qjjhld4s-974t2", status: "Running", tone: "success", restarts: 0, cpu: 62, mem: 38 },
  { name: "checkout-api-rqmxcfxbp-bq7vj", status: "CrashLoopBackOff", tone: "danger", restarts: 14, cpu: 78, mem: 44 },
  { name: "image-resizer-khjm9jqhm-xnh6c", status: "ContainerCreating", tone: "warning", restarts: 0, cpu: 4, mem: 6 },
  { name: "ledger-7mcnr47lw-8shxv", status: "Running", tone: "success", restarts: 0, cpu: 24, mem: 71 },
];
const toneText: Record<string, string> = { success: "text-success", danger: "text-danger", warning: "text-warning" };
const toneBg: Record<string, string> = { success: "bg-success", danger: "bg-danger", warning: "bg-warning" };
</script>

<template>
  <section id="more" class="relative cv-auto py-16 sm:py-24" aria-labelledby="more-title">
    <div class="container-x">
      <div data-reveal class="max-w-2xl">
        <span class="eyebrow">And everything else</span>
        <h3 id="more-title" class="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-[2.5rem] sm:leading-[1.1]">
          The details you reach for every day.
        </h3>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- Metrics -->
        <article data-reveal class="card overflow-hidden p-6 md:col-span-2 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="activity" :size="16" class="text-accent-text" /> Pod health at a glance</div>
          <p class="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-muted">
            Live CPU and memory usage, readiness, restarts and colour-coded statuses — so the broken pod finds you, not the other way round.
          </p>
          <div class="mt-6 overflow-hidden rounded-xl border border-line bg-bg/60" aria-hidden="true">
            <div class="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-line px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-faint sm:grid-cols-[1fr_9rem_3.5rem_5rem]">
              <span>Name</span><span class="hidden sm:block">Status</span><span class="text-right">Restarts</span><span>Usage</span>
            </div>
            <div v-for="pod in pods" :key="pod.name" class="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line px-4 py-2.5 text-[0.8rem] last:border-0 sm:grid-cols-[1fr_9rem_3.5rem_5rem]">
              <span class="truncate font-medium">{{ pod.name }}</span>
              <span class="hidden items-center gap-1.5 sm:flex" :class="toneText[pod.tone]"><span class="size-1.5 rounded-full" :class="toneBg[pod.tone]" />{{ pod.status }}</span>
              <span class="text-right tabular-nums" :class="pod.restarts ? 'text-warning' : 'text-muted'">{{ pod.restarts }}</span>
              <span class="grid w-14 gap-1 sm:w-auto">
                <span class="h-1 rounded-full bg-fg/10"><span class="block h-1 rounded-full" :class="pod.cpu > 70 ? 'bg-warning' : 'bg-success'" :style="{ width: pod.cpu + '%' }" /></span>
                <span class="h-1 rounded-full bg-fg/10"><span class="block h-1 rounded-full" :class="pod.mem > 70 ? 'bg-warning' : 'bg-success'" :style="{ width: pod.mem + '%' }" /></span>
              </span>
            </div>
          </div>
        </article>

        <!-- Port forwarding -->
        <article data-reveal style="--reveal-delay: 80ms" class="card p-6 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="plug" :size="16" class="text-accent-text" /> Port forwarding</div>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">Start, stop and open forwards in your browser. JET Pilot waits until a forward is really ready.</p>
          <div class="mt-6 space-y-2" aria-hidden="true">
            <div v-for="pf in [['payments-api:80', '127.0.0.1:8080'], ['grafana:3000', '127.0.0.1:3000']]" :key="pf[0]" class="flex items-center gap-3 rounded-lg border border-line bg-bg/60 px-3 py-2.5 font-mono text-[0.72rem]">
              <span class="relative flex size-2"><span class="absolute inset-0 animate-ping rounded-full bg-success/50" /><span class="relative size-2 rounded-full bg-success" /></span>
              <span class="truncate">{{ pf[0] }}</span>
              <Icon name="arrowRight" :size="12" class="shrink-0 text-faint" />
              <span class="truncate text-accent-text">{{ pf[1] }}</span>
              <Icon name="arrowUpRight" :size="13" class="ml-auto shrink-0 text-faint" />
            </div>
          </div>
        </article>

        <!-- Helm -->
        <article data-reveal class="card p-6 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="anchor" :size="16" class="text-accent-text" /> Helm releases</div>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">List releases and charts, inspect history, roll back or uninstall.</p>
          <div class="mt-6 space-y-2 text-[0.78rem]" aria-hidden="true">
            <div class="flex items-center gap-3 rounded-lg border border-line bg-bg/60 px-3 py-2.5">
              <span class="font-medium">payments-api</span><span class="font-mono text-faint">rev 42</span>
              <span class="ml-auto flex items-center gap-1.5 text-success"><span class="size-1.5 rounded-full bg-success" />deployed</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg border border-line bg-bg/60 px-3 py-2.5">
              <span class="font-medium">checkout</span><span class="font-mono text-faint">rev 17</span>
              <span class="flex items-center gap-1.5 text-danger"><span class="size-1.5 rounded-full bg-danger" />failed</span>
              <span class="ml-auto inline-flex items-center gap-1 rounded-md border border-line-strong px-2 py-0.5 text-[0.7rem]"><Icon name="refresh" :size="11" />Rollback</span>
            </div>
          </div>
        </article>

        <!-- SSO -->
        <article data-reveal style="--reveal-delay: 80ms" class="card p-6 md:col-span-2 sm:p-7">
          <div class="grid gap-6 sm:grid-cols-2 sm:items-center">
            <div>
              <div class="flex items-center gap-2 text-sm font-medium"><Icon name="key" :size="16" class="text-accent-text" /> SSO &amp; exec-plugin logins</div>
              <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">
                kubelogin / OIDC, AWS SSO and other exec-plugin credentials just work. When a session expires, sign in again without leaving the app.
              </p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span v-for="b in ['kubelogin', 'OIDC', 'AWS SSO', 'exec plugins']" :key="b" class="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-muted">{{ b }}</span>
              </div>
            </div>
            <div class="rounded-xl border border-line bg-surface-3 p-4 shadow-float" aria-hidden="true">
              <div class="flex items-start gap-3">
                <span class="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning"><Icon name="key" :size="14" /></span>
                <div class="min-w-0">
                  <p class="text-[0.82rem] font-medium">Session expired for prod-eu-west-1</p>
                  <p class="mt-0.5 text-[0.76rem] text-muted">Your SSO credentials need a refresh.</p>
                </div>
              </div>
              <div class="mt-4 flex justify-end gap-2 text-[0.75rem]">
                <span class="rounded-md border border-line px-2.5 py-1 text-muted">Later</span>
                <span class="rounded-md bg-accent px-2.5 py-1 font-medium text-white">Sign in again</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Security -->
        <article data-reveal class="card p-6 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="shield" :size="16" class="text-accent-text" /> Hardened by default</div>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">A strict content security policy, minimal app permissions and no secrets written to disk while you edit them.</p>
          <ul class="mt-5 space-y-2 text-[0.8rem]">
            <li v-for="s in ['Strict CSP', 'Minimal permissions', 'Secrets stay in memory']" :key="s" class="flex items-center gap-2 text-fg/85">
              <Icon name="check" :size="14" class="text-success" />{{ s }}
            </li>
          </ul>
        </article>

        <!-- Keyboard -->
        <article data-reveal style="--reveal-delay: 80ms" class="card p-6 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="keyboard" :size="16" class="text-accent-text" /> Keyboard-first</div>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">Start typing to filter any table. Pin your favourite resources and jump to them instantly.</p>
          <div class="mt-5 flex flex-wrap items-center gap-1.5 font-mono text-[0.72rem]" aria-hidden="true">
            <kbd v-for="k in ['⌘1', '⌘2', '⌘3', '…', '⌘9']" :key="k" class="rounded-md border border-line-strong bg-surface-3 px-2 py-1 shadow-[0_1px_0_var(--line-strong)]">{{ k }}</kbd>
          </div>
        </article>

        <!-- Describe & events -->
        <article data-reveal style="--reveal-delay: 160ms" class="card p-6 md:col-span-2 lg:col-span-1 sm:p-7">
          <div class="flex items-center gap-2 text-sm font-medium"><Icon name="layers" :size="16" class="text-accent-text" /> Side panel &amp; events</div>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">Click any pod for containers, conditions, labels, annotations and an events timeline — or open the full describe view.</p>
          <ol class="mt-5 space-y-2 border-l border-line pl-4 text-[0.78rem]" aria-hidden="true">
            <li class="relative"><span class="absolute -left-[1.3rem] top-1.5 size-2 rounded-full bg-warning" /><span class="font-medium">BackOff</span> <span class="text-muted">Back-off restarting failed container</span></li>
            <li class="relative"><span class="absolute -left-[1.3rem] top-1.5 size-2 rounded-full bg-fg/30" /><span class="font-medium">Pulled</span> <span class="text-muted">Container image already present</span></li>
          </ol>
        </article>
      </div>
    </div>
  </section>
</template>
