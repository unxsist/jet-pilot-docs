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
            cluster you work with, updated live.
          </p>
        </div>
      </div>

      <LazyFeatureRow
        hydrate-never
        id="multi-cluster"
        eyebrow="Multi-cluster"
        icon="layers"
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
        alt="The context switcher open with two active contexts, prod-eu-west-1 and staging-us-east-2, each with the payments and checkout namespaces selected"
      />

      <LazyFeatureRow
        hydrate-never
        id="live"
        eyebrow="Live data"
        icon="zap"
        badge="New"
        title="Straight from the API server. No polling."
        lead="Lists stream changes from the Kubernetes API through watches instead of re-running kubectl. Updates land in a fraction of a second, and coming back to a view is instant."
        :points="[
          'Scale a Deployment and the table follows in <strong>~200 ms</strong>',
          'A 2,000-pod snapshot loads in about <strong>0.7 s</strong>',
          'CPU and memory <strong>sparklines</strong> for every pod',
          'Tested against a real kube-apiserver with thousands of pods',
        ]"
        shot="live"
        :zoom="1.55"
        focus="68% 0%"
        alt="The pods table with CPU and memory sparkline columns next to each pod's status"
        reverse
      >
        <template #overlay>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-6 left-4 rounded-2xl border border-line-strong bg-surface-3/90 px-4 py-3 shadow-float backdrop-blur sm:-bottom-8 sm:-left-6 sm:px-5 sm:py-4"
          >
            <div class="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
              <span class="relative flex size-2"><span class="absolute inset-0 rounded-full bg-success/60 motion-safe:animate-[pulse-dot_2s_ease-in-out_infinite]" /><span class="relative size-2 rounded-full bg-success" /></span>
              scale → screen
            </div>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">~200</span>
              <span class="font-mono text-sm text-faint">ms</span>
            </div>
          </div>
        </template>
      </LazyFeatureRow>

      <LazyFeatureRow
        hydrate-never
        id="graph"
        eyebrow="Resource graph"
        icon="graph"
        badge="Reimagined"
        title="Every app, mapped. What’s broken, first."
        lead="Each app gets its own lane — Ingress → Service → workload → Pods — with its config, storage, scaling and policies alongside. Health rolls up from pods to apps, and the graph updates live."
        :points="[
          'ConfigMaps, Secrets, PVCs, ServiceAccounts, HPAs, PDBs and NetworkPolicies, in context',
          'Missing references show up as <strong>red dashed nodes</strong>; <kbd>P</kbd> shows only the problems',
          'Click a node to light up its full path, with details in the side panel',
          'Search, filters and a minimap — and Secret values never reach the graph',
        ]"
        shot="graph"
        :zoom="1.2"
        focus="100% 0%"
        alt="The resource graph with the checkout-api Deployment selected: its Service, PodDisruptionBudget and ConfigMap highlighted along the path, and a side panel listing its pods, relationships and replica status"
      />

      <LazyFeatureRow
        hydrate-never
        id="logs"
        eyebrow="Logs"
        icon="logs"
        badge="New"
        title="Every pod’s logs. One stream."
        lead="Open logs on a Deployment, StatefulSet, DaemonSet, Job or Service and follow all of its pods at once, colour-coded per pod. JSON lines are still parsed into fields you can filter on."
        :points="[
          'Filter by pod and container, or read previous containers',
          'Search with match navigation; pause the view while the tail keeps up',
          'Facets for level, logger and any other parsed field',
          'Export what you’re looking at to a file',
        ]"
        shot="logs"
        :zoom="1.3"
        focus="70% 100%"
        alt="Logs for the payments-api Deployment: four pods listed with their own colours, container and field filters, and interleaved log lines prefixed with the pod and container they came from"
        reverse
      />

      <LazyFeatureRow
        hydrate-never
        id="editor"
        eyebrow="YAML editor"
        icon="code"
        badge="New"
        title="See the change before the cluster does."
        lead="The Monaco editor — the one behind VS Code — is now bundled, so it works offline. It reads your cluster’s own OpenAPI schemas, CRDs included, and every save shows a diff and runs a server-side dry run before anything is applied."
        :points="[
          'Completion, hover docs and validation from the cluster’s schemas',
          'Diff and server-side dry run on <kbd>⌘S</kbd> / <kbd>Ctrl+S</kbd> — then apply',
          'Compare an object across contexts, side by side',
          'Secrets are never written to disk while you edit them',
        ]"
        shot="editor"
        :zoom="1.2"
        focus="95% 100%"
        alt="Reviewing changes to the payments-api Deployment: a side-by-side diff with replicas changed from 4 to 6 and a new image tag, and a “Server dry run passed” status next to the Apply button"
      />

      <LazyFeatureRow
        hydrate-never
        id="workloads"
        eyebrow="Workloads"
        icon="refresh"
        badge="New"
        title="Roll out, roll back, debug."
        lead="The things you’d reach for kubectl rollout, helm or kubectl debug for — a click away, with a preview before anything changes."
        :points="[
          'Rollout history with a diff per revision and a safe rollback',
          'Helm upgrades with a values diff, plus release history',
          'Ephemeral debug containers and node shells',
          'Copy files to and from containers, like <code>kubectl cp</code>',
        ]"
        shot="rollouts"
        :zoom="1.2"
        focus="95% 100%"
        alt="Rollout history for the payments-api Deployment: a list of revisions with their change causes and images, and a diff between the current revision and r6 with a “Roll back to r6” button"
        reverse
      />

      <LazyFeatureRow
        hydrate-never
        id="workspaces"
        eyebrow="Workspaces"
        icon="columns"
        badge="New"
        title="Pick up exactly where you left off."
        lead="Save the contexts, namespaces, open tabs and running port forwards for a task as a workspace, then switch in one keystroke. Split view puts two tabs side by side, and your tabs come back when you restart."
        :points="[
          'Switch with <kbd>⌘⌥</kbd> / <kbd>Ctrl+Alt</kbd> + <kbd>1</kbd>–<kbd>9</kbd>, or from the command palette',
          'Split view: describe next to logs, or any two tabs',
          'Port-forward profiles that start when JET Pilot launches',
        ]"
        shot="workspaces"
        :zoom="1.15"
        focus="0% 45%"
        alt="The workspace switcher listing Payments on-call, Checkout incident, Staging rollout and Platform &amp; ingress with their shortcuts, above a split view of a describe tab and a logs tab"
      />

      <LazyFeatureRow
        hydrate-never
        id="command-palette"
        eyebrow="Keyboard"
        icon="command"
        title="Everything is a keystroke away."
        lead="Hit ⌘K or Ctrl+K and fuzzy-search your way anywhere: resources, workspaces, Helm, settings, a fresh terminal, or a different context and namespace. Tables are keyboard-first, too."
        :points="[
          'Jump to any resource kind, including CRDs',
          'k9s-style rows: arrows or <kbd>j</kbd>/<kbd>k</kbd> to move, <kbd>l</kbd> logs, <kbd>s</kbd> shell, <kbd>e</kbd> edit — <kbd>?</kbd> shows them all',
          'Pinned resources on <kbd>⌘1</kbd>–<kbd>⌘9</kbd> / <kbd>Ctrl+1</kbd>–<kbd>9</kbd>',
        ]"
        shot="command-palette"
        :zoom="1.25"
        focus="45% 25%"
        alt="The command palette open over the pods table, listing Switch workspace, Save workspace, Open terminal, Switch context and Switch namespace actions"
        reverse
      >
        <template #overlay>
          <div aria-hidden="true" class="pointer-events-none absolute -bottom-6 left-4 flex items-end gap-2 sm:-bottom-8 sm:-left-6">
            <span class="keycap">⌘</span>
            <span class="keycap" style="animation-delay: 0.12s">K</span>
          </div>
        </template>
      </LazyFeatureRow>

      <LazyFeatureRow
        hydrate-never
        id="terminal"
        eyebrow="Built-in terminal"
        icon="terminal"
        title="A terminal that already knows where you are."
        lead="Press Ctrl+` and a terminal opens with kubectl pointed at the current context. It uses a temporary single-context kubeconfig, so your own kubeconfig is never touched."
        :points="[
          '<kbd>Ctrl</kbd> + <kbd>`</kbd> from anywhere, or “Open terminal” in the command palette',
          'One-click shells into any container with <code>kubectl exec</code>',
          'Pod shells work on Windows, too',
        ]"
        shot="terminal"
        :zoom="1.3"
        focus="0% 100%"
        alt="The built-in terminal panel below the pods table, opened for prod-eu-west-1 with a note that KUBECONFIG points to a temporary copy"
      />

      <LazyThemesTeaser hydrate-on-visible />
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
