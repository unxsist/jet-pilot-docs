<template>
  <main id="main">
    <HeroSection />
    <LazyClusterStrip hydrate-never />

    <div id="features" class="relative">
      <div class="container-x pt-10 sm:pt-16">
        <div data-reveal class="mx-auto max-w-4xl text-center">
          <span class="eyebrow">Features</span>
          <h2 class="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl sm:leading-[1.02]">
            <span class="text-shine">The power of kubectl. Without the squinting.</span>
          </h2>
          <p class="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            JET Pilot keeps the power of the command line and adds the overview you can’t get from it — across every
            cluster you work with.
          </p>
        </div>
      </div>

      <LazyFeatureRow
        hydrate-never
        id="multi-cluster"
        eyebrow="Multi-cluster"
        icon="layers"
        badge="New"
        title="Every cluster. Every namespace. One table."
        lead="Select several contexts — even from different kubeconfig files — and any mix of namespaces. JET Pilot merges them into one view, so comparing prod and staging is a glance, not a context switch."
        :points="[
          'Pick contexts and namespaces from one switcher',
          'Tables aggregate everything, with <strong>Context</strong> and <strong>Namespace</strong> columns',
          'Colour-coded context avatars show where every row comes from',
        ]"
        shot="context-switcher"
        :zoom="1.5"
        focus="0% 0%"
        alt="The context switcher open with two active contexts, prod-eu-west-1 and staging-us-east-2, and the payments and checkout namespaces selected"
      />

      <LazyFeatureRow
        hydrate-never
        id="terminal"
        eyebrow="Built-in terminal"
        icon="terminal"
        badge="New"
        title="A terminal that already knows where you are."
        lead="Press Ctrl+` and a terminal opens with kubectl pointed at the current context. It uses a temporary single-context kubeconfig, so your own kubeconfig is never touched."
        :points="[
          '<kbd>Ctrl</kbd> + <kbd>`</kbd> from anywhere, or “Open terminal” in the command palette',
          'One-click shells into any container with <code>kubectl exec</code>',
          'Pod shells now work on Windows, too',
        ]"
        shot="terminal"
        :zoom="1.3"
        focus="0% 100%"
        alt="The built-in terminal panel running kubectl get deployments and kubectl rollout status against prod-eu-west-1"
        reverse
      />

      <LazyFeatureRow
        hydrate-never
        id="graph"
        eyebrow="Resource graph"
        icon="graph"
        title="See how it all fits together."
        lead="A live map of a namespace: Services lead to Deployments, ReplicaSets and Pods, with ConfigMaps, Secrets, Jobs and Ingresses alongside. Health dots show what’s ready and what’s struggling."
        :points="[
          'Spot a failing ReplicaSet behind a healthy Service instantly',
          'Pod health summarised per workload, at a glance',
          'Zoom, pan, fit and refresh — across one or more namespaces',
        ]"
        shot="graph"
        :zoom="1.2"
        focus="100% 0%"
        alt="The resource graph for the payments namespace showing services, deployments, replica sets and pods with green and orange health dots"
      />

      <LazyFeatureRow
        hydrate-never
        id="logs"
        eyebrow="Structured logs"
        icon="logs"
        title="Logs you can actually read."
        lead="Follow logs live and let JET Pilot parse JSON lines into fields. Filter by level, logger or any other field from the sidebar, search, and jump between time ranges."
        :points="[
          'Facet sidebar with counts for every parsed field',
          'Level colours so warnings and errors stand out',
          'Live tail, head / tail and 1m – 1h time ranges',
        ]"
        shot="logs"
        :zoom="1.3"
        focus="0% 100%"
        alt="The structured log viewer with Level and Logger facets expanded, and JSON log lines coloured by level"
        reverse
      />

      <LazyFeatureRow
        hydrate-never
        id="editor"
        eyebrow="YAML editor"
        icon="code"
        title="Edit anything, with an editor you already know."
        lead="Open any object in a Monaco-powered YAML editor — the editor behind VS Code — and apply with ⌘S or Ctrl+S. Create new objects just as easily, or read the full describe output."
        :points="[
          'Syntax highlighting, folding and indentation guides',
          'Create and edit any resource, including custom resources',
          'Secrets are never written to disk while you edit them',
        ]"
        shot="yaml"
        :zoom="1.35"
        focus="0% 100%"
        alt="A pod manifest open in the YAML editor below the pods table"
      />

      <LazyFeatureRow
        hydrate-never
        id="command-palette"
        eyebrow="Command palette"
        icon="command"
        title="Everything is a keystroke away."
        lead="Hit ⌘K or Ctrl+K and fuzzy-search your way anywhere: resources, Helm, settings, a fresh terminal, or a different context and namespace."
        :points="[
          'Jump to any resource kind, including CRDs',
          'Switch context or namespace without touching the mouse',
          'Pinned resources on <kbd>⌘1</kbd>–<kbd>⌘9</kbd> / <kbd>Ctrl+1</kbd>–<kbd>9</kbd>',
        ]"
        shot="command-palette"
        :zoom="1.25"
        focus="45% 25%"
        alt="The command palette open over the pods table, listing Open terminal, Switch context and Switch namespace actions"
        reverse
      >
        <template #overlay>
          <div aria-hidden="true" class="pointer-events-none absolute -bottom-6 left-4 flex items-end gap-2 sm:-bottom-8 sm:-left-6">
            <span class="keycap">⌘</span>
            <span class="keycap" style="animation-delay: 0.12s">K</span>
          </div>
        </template>
      </LazyFeatureRow>
    </div>

    <LazyThemeCompare hydrate-on-visible />
    <LazyFeatureBento hydrate-never />
    <LazyStatsRow hydrate-never />
    <LazyWhatsNew hydrate-on-visible />
    <LazyDownloadSection hydrate-on-visible />
    <LazyOpenSource hydrate-on-visible />
    <LazyFaqSection hydrate-never />
    <LazySiteFooter hydrate-on-visible />
  </main>
</template>

<style>
.keycap {
  display: inline-flex;
  height: 3.75rem;
  min-width: 3.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  border: 1px solid var(--line-strong);
  background: linear-gradient(180deg, var(--surface-3), var(--surface-2));
  padding: 0 1rem;
  font-family: var(--font-sans);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--fg);
  box-shadow:
    0 1px 0 var(--line-strong),
    0 4px 0 color-mix(in srgb, var(--fg) 14%, transparent),
    0 10px 24px -8px rgb(0 0 0 / 0.35);
  animation: keycap-press 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
@media (min-width: 640px) {
  .keycap {
    height: 4.5rem;
    min-width: 4.5rem;
    font-size: 1.9rem;
  }
}
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
