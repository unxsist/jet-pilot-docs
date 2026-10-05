<script setup lang="ts">
/*
 * A compact HTML/CSS replica of the JET Pilot window, painted only with the
 * app's own CSS custom properties (bare HSL triplets, used as
 * hsl(var(--token))) plus the terminal and editor colours. The variables
 * are set inline on the root (see lookStyle), so they never leak into the
 * page around it and switching themes is a style swap.
 *
 * Laid out at a fixed design size and scaled to its container with CSS
 * (container query units), so it looks like a screenshot at any width
 * without JavaScript or layout shift. Below 640px it switches to a
 * narrower layout (no sidebar, stacked panes).
 */
import type { ThemeLook } from "~/lib/themeLook";
import { lookStyle } from "~/lib/themeLook";

const props = withDefaults(defineProps<{ look: ThemeLook; view?: "pods" | "graph"; label?: string }>(), {
  view: "pods",
  label: "",
});

const style = computed(() => lookStyle(props.look));

/* Lucide (ISC) paths, just the ones the replica draws. */
const icons: Record<string, string> = {
  pods: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5M12 22V12",
  deployments: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
  services: "M16 16h6v6h-6zM2 16h6v6H2zM9 2h6v6H9zM5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8",
  graph: "M3 3h6v6H3zM15 15h6v6h-6zM6 9v3a3 3 0 0 0 3 3h6",
  events: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
  namespaces: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM3 5a2 2 0 0 0 2 2h3M3 3v13a2 2 0 0 0 2 2h3",
  nodes: "M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM6 6h.01M6 18h.01",
  cron: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  jobs: "M13 5h8M13 12h8M13 19h8M3 17l2 2 4-4M3 7l2 2 4-4",
  settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  updown: "m7 15 5 5 5-5M7 9l5-5 5 5",
  chevron: "m9 18 6-6-6-6",
  down: "m6 9 6 6 6-6",
  group: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
  columns: "M12 3v18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  terminal: "m4 17 6-6-6-6M12 19h8",
  code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
  x: "M18 6 6 18M6 6l12 12",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0",
  disk: "M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01",
  file: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4",
  key: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4M21 2l-9.6 9.6M7.5 21a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z",
  alert: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
};

const nav = [
  { section: "Pinned" },
  { icon: "pods", label: "Pods", kbd: "⌘1", id: "pods" },
  { icon: "deployments", label: "Deployments", kbd: "⌘2" },
  { icon: "services", label: "Services", kbd: "⌘3" },
  { gap: true },
  { icon: "graph", label: "Resource Graph", id: "graph" },
  { section: "Cluster" },
  { icon: "events", label: "Events" },
  { icon: "namespaces", label: "Namespaces" },
  { icon: "nodes", label: "Nodes" },
  { section: "Workloads" },
  { icon: "cron", label: "CronJobs" },
  { icon: "deployments", label: "DaemonSets" },
  { icon: "jobs", label: "Jobs" },
  { icon: "deployments", label: "StatefulSets" },
] as const;

type Tone = "ok" | "bad" | "warn" | "done" | "gone";
const pods: {
  ns: string;
  name: string;
  ready: string;
  restarts: number;
  status: string;
  tone: Tone;
  cpu: number | null;
  mem: number | null;
  ip: string;
  seed: number;
}[] = [
  { ns: "payments", name: "payments-api-7qjjhld4s-974t2", ready: "2/2", restarts: 0, status: "Running", tone: "ok", cpu: 929, mem: 250, ip: "10.42.84.10", seed: 1 },
  { ns: "payments", name: "payments-api-7qjjhld4s-trrmk", ready: "2/2", restarts: 1, status: "Running", tone: "ok", cpu: 829, mem: 279, ip: "10.42.84.23", seed: 2 },
  { ns: "payments", name: "payments-worker-qsz8hdz2p-vkn4v", ready: "0/1", restarts: 3, status: "OOMKilled", tone: "bad", cpu: 41, mem: 115, ip: "10.42.105.36", seed: 3 },
  { ns: "payments", name: "ledger-7mcnr47lw-8shxv", ready: "1/1", restarts: 0, status: "Running", tone: "ok", cpu: 354, mem: 786, ip: "10.42.42.10", seed: 4 },
  { ns: "checkout", name: "checkout-api-rqmxcfxbp-bq7vj", ready: "0/1", restarts: 14, status: "CrashLoopBackOff", tone: "bad", cpu: 829, mem: 233, ip: "10.42.84.23", seed: 5 },
  { ns: "checkout", name: "checkout-web-7s58ws2gs-2mtc4", ready: "1/1", restarts: 0, status: "Running", tone: "ok", cpu: 390, mem: 164, ip: "10.42.84.10", seed: 6 },
  { ns: "checkout", name: "image-resizer-khjm9jqhm-xnh6c", ready: "0/1", restarts: 0, status: "ContainerCreating", tone: "warn", cpu: null, mem: null, ip: "10.42.91.23", seed: 7 },
  { ns: "payments", name: "db-backup-28745160-9cwmp", ready: "0/1", restarts: 0, status: "Completed", tone: "done", cpu: null, mem: null, ip: "10.42.126.10", seed: 8 },
  { ns: "checkout", name: "cart-service-67xd8brb7-9wqfk", ready: "1/1", restarts: 0, status: "Terminating", tone: "gone", cpu: null, mem: null, ip: "10.42.84.23", seed: 9 },
];

/* Deterministic, decorative usage history (viewBox 0 0 44 14). */
const spark = (seed: number, level: number) =>
  Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin(i * 0.95 + seed * 1.7) * 0.55 + Math.sin(i * 2.2 + seed) * 0.3;
    const v = Math.min(92, Math.max(8, level + wave * Math.max(10, level * 0.3)));
    return `${(i * 4).toFixed(0)},${(13 - (v / 100) * 12).toFixed(1)}`;
  }).join(" ");

/* Terminal: a `kubectl get pods` run through a colouriser, then the ANSI palette. */
type Seg = [string, string?];
const term: Seg[][] = [
  [["jet", "green"], [":", "white"], ["~/payments", "blue"], ["$ ", "white"], ["kubectl get pods -n payments", "fg"]],
  [["NAME                              READY   STATUS      AGE", "brightBlack"]],
  [["payments-api-7qjjhld4s-974t2      2/2     "], ["Running", "green"], ["     3d"]],
  [["payments-worker-qsz8hdz2p-vkn4v   0/1     "], ["OOMKilled", "red"], ["   3d"]],
  [["ledger-7mcnr47lw-8shxv            1/1     "], ["Running", "green"], ["     5d"]],
  [["db-backup-28745160-9cwmp          0/1     "], ["Completed", "cyan"], ["   41m"]],
  [["jet", "green"], [":", "white"], ["~/payments", "blue"], ["$ ", "white"], ["kubectl rollout status deploy/payments-api", "fg"]],
  [["deployment "], ['"payments-api"', "yellow"], [" successfully rolled out"]],
  [["jet", "green"], [":", "white"], ["~/payments", "blue"], ["$ ", "white"], ["colortest", "fg"]],
];
const normal = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const bright = normal.map((c) => `bright${c[0]!.toUpperCase()}${c.slice(1)}`);
const termColor = (c?: string) => (!c || c === "fg" ? undefined : `var(--term-${c})`);

/* YAML: [text, syntax slot][] per line. */
type Tok = [string, ("key" | "string" | "number" | "constant" | "comment" | "punctuation" | "text")?];
const yaml: Tok[][] = [
  [["apiVersion", "key"], [":", "punctuation"], [" apps/v1", "string"]],
  [["kind", "key"], [":", "punctuation"], [" Deployment", "string"]],
  [["metadata", "key"], [":", "punctuation"]],
  [["  name", "key"], [":", "punctuation"], [" payments-api", "string"]],
  [["  namespace", "key"], [":", "punctuation"], [" payments", "string"]],
  [["spec", "key"], [":", "punctuation"]],
  [["  replicas", "key"], [":", "punctuation"], [" 6", "number"], ["  # was 4", "comment"]],
  [["  paused", "key"], [":", "punctuation"], [" false", "constant"]],
  [["  strategy", "key"], [":", "punctuation"]],
  [["    type", "key"], [":", "punctuation"], [" RollingUpdate", "string"]],
  [["  template", "key"], [":", "punctuation"]],
  [["    spec", "key"], [":", "punctuation"]],
  [["      containers", "key"], [":", "punctuation"]],
  [["        ", "text"], ["-", "punctuation"], [" name", "key"], [":", "punctuation"], [" api", "string"]],
  [["          image", "key"], [":", "punctuation"], [" ghcr.io/acme/payments-api:v2.15.0", "string"]],
  [["          ports", "key"], [":", "punctuation"]],
  [["            ", "text"], ["-", "punctuation"], [" containerPort", "key"], [":", "punctuation"], [" 8080", "number"]],
  [["          resources", "key"], [":", "punctuation"], [" { ", "punctuation"], ["limits", "key"], [": ", "punctuation"], ["{ ", "punctuation"], ["cpu", "key"], [": ", "punctuation"], ['"1"', "string"], [" } }", "punctuation"]],
];
const activeLine = 6;
</script>

<template>
  <div class="jp-fit" :class="`jp-fit--${view}`">
    <div
      class="jp"
      :class="[`jp--${view}`, look.appearance === 'dark' ? 'jp--dark' : 'jp--light']"
      :style="style"
      role="img"
      :aria-label="label || `JET Pilot in the ${look.appearance} appearance`"
    >
      <!-- Sidebar -->
      <aside class="jp-side">
        <div class="jp-lights" aria-hidden="true"><i /><i /><i /></div>
        <div class="jp-ctx">
          <span class="jp-avatar">PE<b /></span>
          <span class="jp-ctx-text">
            <strong>prod-eu-west-1</strong>
            <small>2 namespaces · payments, checkout</small>
          </span>
          <svg class="jp-i jp-dim" viewBox="0 0 24 24"><path :d="icons.updown" /></svg>
        </div>
        <div class="jp-ws">
          <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.group" /></svg>
          <span>No workspace</span>
          <svg class="jp-i jp-dim" viewBox="0 0 24 24"><path :d="icons.updown" /></svg>
        </div>
        <div class="jp-search">
          <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.search" /></svg>
          <span>Search or run…</span>
          <kbd>⌘</kbd><kbd>K</kbd>
        </div>
        <div class="jp-pf"><b />1 port forward<svg class="jp-i jp-dim" viewBox="0 0 24 24"><path :d="icons.chevron" /></svg></div>

        <nav class="jp-nav">
          <template v-for="(item, i) in nav" :key="i">
            <p v-if="'section' in item" class="jp-section">{{ item.section }}</p>
            <span v-else-if="'gap' in item" class="jp-gap" />
            <span v-else class="jp-item" :class="{ 'is-active': 'id' in item && item.id === view }">
              <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons[item.icon]" /></svg>
              {{ item.label }}
              <kbd v-if="'kbd' in item">{{ item.kbd }}</kbd>
            </span>
          </template>
        </nav>
        <div class="jp-settings">
          <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.settings" /></svg>
          Settings
        </div>
      </aside>

      <!-- Main -->
      <section class="jp-main">
        <template v-if="view === 'pods'">
          <header class="jp-toolbar">
            <span class="jp-filter">
              <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.search" /></svg>
              Filter pods…
              <kbd>/</kbd>
            </span>
            <span class="jp-count">43 pods</span>
            <span class="jp-tool"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.group" /></svg>Group</span>
            <span class="jp-tool"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.columns" /></svg>Columns</span>
          </header>

          <div class="jp-table">
            <div class="jp-tr jp-th">
              <span class="jp-check" /><span class="c-ns">Namespace</span><span class="c-name">Name</span><span class="c-ready">Ready</span><span class="c-rs">Restarts</span><span class="c-status">Status</span><span class="c-cpu">CPU</span><span class="c-mem">Memory</span><span class="c-ip">IP</span>
            </div>
            <div
              v-for="(pod, i) in pods"
              :key="pod.name"
              class="jp-tr"
              :class="[`is-${pod.tone}`, { 'is-selected': i === 0 }]"
            >
              <span class="jp-check" />
              <span class="c-ns jp-muted">{{ pod.ns }}</span>
              <span class="c-name">{{ pod.name }}</span>
              <span class="c-ready" :class="{ 'jp-warn': pod.ready.startsWith('0') && pod.tone !== 'done' }">{{ pod.ready }}</span>
              <span class="c-rs" :class="{ 'jp-warn': pod.restarts > 0 }">{{ pod.restarts }}</span>
              <span class="c-status"><b />{{ pod.status }}</span>
              <span class="c-cpu">
                <template v-if="pod.cpu !== null">
                  <svg viewBox="0 0 44 14" preserveAspectRatio="none" :class="{ hot: pod.cpu > 800 }"><polyline :points="spark(pod.seed, pod.cpu / 10)" /></svg>
                  {{ pod.cpu }}m
                </template>
                <template v-else>–</template>
              </span>
              <span class="c-mem">
                <template v-if="pod.mem !== null">
                  <svg viewBox="0 0 44 14" preserveAspectRatio="none" :class="{ hot: pod.mem > 700 }"><polyline :points="spark(pod.seed + 3, pod.mem / 10)" /></svg>
                  {{ pod.mem }}Mi
                </template>
                <template v-else>–</template>
              </span>
              <span class="c-ip">{{ pod.ip }}</span>
            </div>
          </div>

          <!-- Bottom panel, split: terminal | editor -->
          <div class="jp-panel">
            <div class="jp-pane jp-pane--term">
              <div class="jp-tabbar">
                <span class="jp-tab is-current"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.terminal" /></svg>Terminal · prod-eu-west-1<svg class="jp-i jp-x" viewBox="0 0 24 24"><path :d="icons.x" /></svg></span>
              </div>
              <div class="jp-term">
                <p v-for="(line, i) in term" :key="i">
                  <span v-for="(seg, j) in line" :key="j" :style="{ color: termColor(seg[1]) }">{{ seg[0] }}</span>
                </p>
                <p class="jp-ansi">
                  <span v-for="c in normal" :key="c" :style="{ background: `var(--term-${c})` }" />
                </p>
                <p class="jp-ansi">
                  <span v-for="c in bright" :key="c" :style="{ background: `var(--term-${c})` }" />
                </p>
                <p>
                  <span style="color: var(--term-green)">jet</span><span style="color: var(--term-white)">:</span><span style="color: var(--term-blue)">~/payments</span><span style="color: var(--term-white)">$ </span><span class="jp-cursor" />
                </p>
              </div>
            </div>
            <div class="jp-pane jp-pane--editor">
              <div class="jp-tabbar">
                <span class="jp-tab"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.code" /></svg>deployment/payments-api<i class="jp-dot" /></span>
                <span class="jp-review">Review &amp; apply</span>
              </div>
              <div class="jp-editor">
                <p v-for="(line, i) in yaml" :key="i" :class="{ 'is-active': i === activeLine }">
                  <span class="jp-ln">{{ i + 1 }}</span>
                  <span v-for="(tok, j) in line" :key="j" :class="`s-${tok[1] ?? 'text'}`">{{ tok[0] }}</span>
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Resource graph -->
        <template v-else>
          <header class="jp-toolbar">
            <span class="jp-ctx-chip"><span class="jp-avatar jp-avatar--sm">PE</span>prod-eu-west-1</span>
            <span class="jp-filter jp-filter--sm">
              <svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.search" /></svg>
              Find an object…
              <kbd>/</kbd>
            </span>
            <span class="jp-tool"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.filter" /></svg>Filters</span>
            <span class="jp-tool jp-problems"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.alert" /></svg>Problems <em>3</em></span>
            <span class="jp-health"><strong>6</strong> apps <i class="ok" />4 <i class="warn" />1 <i class="bad" />1</span>
          </header>
          <div class="jp-graph">
            <p class="jp-lane-title"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.namespaces" /></svg>checkout · 3 apps</p>
            <div class="jp-lane">
              <div class="jp-app is-warn">
                <p class="jp-app-title"><i class="warn" />checkout-api<span>1 issue · 3 pods</span></p>
                <div class="jp-flow">
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.globe" /></svg></span><span><strong>checkout</strong><small>Ingress · checkout.acme.dev</small></span><i class="ok" /></div>
                  <span class="jp-edge" />
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.services" /></svg></span><span><strong>checkout-api</strong><small>Service · ClusterIP · 80</small></span><i class="ok" /></div>
                  <span class="jp-edge" />
                  <div class="jp-node is-focus"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.deployments" /></svg></span><span><strong>checkout-api</strong><small>Deployment · 2/3 ready</small></span><i class="warn" /><span class="jp-pods"><b class="ok" /><b class="ok" /><b class="bad" /></span></div>
                </div>
                <div class="jp-flow jp-flow--side">
                  <div class="jp-node jp-node--sm"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.key" /></svg></span><span><strong>checkout-tls</strong><small>Secret · tls</small></span></div>
                  <div class="jp-node jp-node--sm"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.file" /></svg></span><span><strong>checkout-flags</strong><small>ConfigMap · 1 key</small></span></div>
                </div>
              </div>
            </div>
            <div class="jp-lane jp-lane--two">
              <div class="jp-app is-bad">
                <p class="jp-app-title"><i class="bad" />redis<span>2 issues · 1 pod</span></p>
                <div class="jp-flow">
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.services" /></svg></span><span><strong>redis</strong><small>Service · 6379</small></span><i class="ok" /></div>
                  <span class="jp-edge" />
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.database" /></svg></span><span><strong>redis</strong><small>StatefulSet · 0/1 ready</small></span><i class="bad" /></div>
                  <span class="jp-edge jp-edge--uses" />
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.disk" /></svg></span><span><strong>data-redis-0</strong><small>PVC · 8Gi · Pending</small></span><i class="warn" /></div>
                </div>
              </div>
              <div class="jp-app is-ok">
                <p class="jp-app-title"><i class="ok" />checkout-web<span>2 pods</span></p>
                <div class="jp-flow">
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.services" /></svg></span><span><strong>checkout-web</strong><small>Service · 3000</small></span><i class="ok" /></div>
                </div>
              </div>
            </div>
            <div class="jp-lane">
              <div class="jp-app is-bad">
                <p class="jp-app-title"><i class="bad" />legacy-site<span>1 issue</span></p>
                <div class="jp-flow">
                  <div class="jp-node"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.globe" /></svg></span><span><strong>legacy-site</strong><small>Ingress · www.acme.dev</small></span><i class="bad" /></div>
                  <span class="jp-edge jp-edge--missing" />
                  <div class="jp-node is-missing"><span class="jp-node-icon"><svg class="jp-i" viewBox="0 0 24 24"><path :d="icons.services" /></svg></span><span><strong>legacy-frontend</strong><small>Service · not found</small></span><em>Missing</em></div>
                </div>
              </div>
            </div>
            <div class="jp-legend">
              <span><i class="l-traffic" />Traffic</span><span><i class="l-owns" />Owns</span><span><i class="l-uses" />Uses</span><span><i class="l-missing" />Missing</span>
              <span><b class="ok" />ok</span><span><b class="warn" />degraded</span><span><b class="bad" />failing</span>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* --------------------------------------------------------------- fit */
.jp-fit {
  --w: 1120;
  --h: 720;
  position: relative;
  container-type: inline-size;
  aspect-ratio: var(--w) / var(--h);
  overflow: hidden;
  border-radius: 12px;
}
.jp {
  position: absolute;
  inset: 0 auto auto 0;
  width: calc(var(--w) * 1px);
  height: calc(var(--h) * 1px);
  transform-origin: 0 0;
  scale: tan(atan2(100cqw, calc(var(--w) * 1px)));
}
@media (max-width: 639px) {
  .jp-fit {
    --w: 520;
    --h: 860;
  }
  .jp-fit--graph {
    --h: 820;
  }
}

/* ------------------------------------------------------------ window */
.jp {
  display: flex;
  overflow: hidden;
  border-radius: 12px;
  background: hsl(var(--surface-1));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
  font-size: 12.5px;
  line-height: 1.35;
  letter-spacing: -0.003em;
  text-align: left;
  font-feature-settings: "cv11", "ss01", "ss03";
}
.jp *,
.jp *::before,
.jp *::after {
  transition:
    background-color 0.35s var(--ease-out-expo),
    border-color 0.35s var(--ease-out-expo),
    color 0.35s var(--ease-out-expo),
    fill 0.35s,
    stroke 0.35s;
}
.jp p {
  margin: 0;
}
.jp kbd {
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
}
.jp-i {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.jp-dim {
  opacity: 0.7;
  width: 13px;
  height: 13px;
}
.jp-muted {
  color: hsl(var(--muted-foreground));
}
.jp-warn {
  color: hsl(var(--warning));
}

/* ----------------------------------------------------------- sidebar */
.jp-side {
  position: relative;
  display: flex;
  width: 206px;
  flex-shrink: 0;
  flex-direction: column;
  gap: 6px;
  padding: 36px 8px 8px;
  color: hsl(var(--sidebar-foreground));
}
.jp-lights {
  position: absolute;
  left: 13px;
  top: 12px;
  display: flex;
  gap: 8px;
}
.jp-lights i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff5f57;
  box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 0.12);
}
.jp-lights i:nth-child(2) {
  background: #febc2e;
}
.jp-lights i:nth-child(3) {
  background: #28c840;
}
.jp-ctx {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 8px;
  border-radius: 9px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--surface-2));
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}
.jp-avatar {
  position: relative;
  display: inline-flex;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  border: 1px solid hsl(var(--success) / 0.35);
  background: hsl(var(--success) / 0.14);
  color: hsl(var(--success));
  font-size: 11px;
  font-weight: 600;
}
.jp-avatar b {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: hsl(var(--success));
  box-shadow: 0 0 0 2px hsl(var(--surface-2));
}
.jp-avatar--sm {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  font-size: 8.5px;
}
.jp-ctx-text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}
.jp-ctx-text strong {
  font-size: 12.5px;
  font-weight: 600;
  color: hsl(var(--foreground));
}
.jp-ctx-text small {
  overflow: hidden;
  font-size: 10.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: hsl(var(--muted-foreground));
}
.jp-ws {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 8px;
  font-size: 11px;
  color: hsl(var(--muted-foreground));
}
.jp-ws span {
  flex: 1;
}
.jp-ws .jp-i {
  width: 13px;
  height: 13px;
}
.jp-search {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 30px;
  padding: 0 6px 0 9px;
  border-radius: 7px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background) / 0.5);
  color: hsl(var(--muted-foreground));
}
.jp-search span {
  flex: 1;
}
.jp-search .jp-i {
  width: 14px;
  height: 14px;
}
.jp-search kbd + kbd {
  margin-left: -3px;
}
.jp-pf {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px 0 10px;
  border-radius: 7px;
  border: 1px solid hsl(var(--success) / 0.3);
  background: hsl(var(--success) / 0.1);
  color: hsl(var(--foreground));
  font-size: 12px;
}
.jp-pf b {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: hsl(var(--success));
}
.jp-pf .jp-i {
  margin-left: auto;
}
.jp-nav {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 4px;
}
.jp-section {
  padding: 12px 8px 5px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}
.jp-gap {
  height: 8px;
}
.jp-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 27px;
  padding: 0 8px;
  border-radius: 6px;
}
.jp-item kbd {
  margin-left: auto;
  border: 0;
  background: none;
  padding: 0;
  font-size: 10px;
}
.jp-item.is-active {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  font-weight: 500;
}
.jp-item.is-active .jp-i {
  color: hsl(var(--primary));
}
.jp-item.is-active::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 5px;
  bottom: 5px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: hsl(var(--primary));
}
.jp-settings {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: auto -8px 0;
  padding: 10px 16px 2px;
  border-top: 1px solid hsl(var(--border-subtle));
}

/* -------------------------------------------------------------- main */
.jp-main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin: 8px 8px 8px 0;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
}
.jp-toolbar {
  display: flex;
  height: 44px;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid hsl(var(--border));
  color: hsl(var(--muted-foreground));
}
.jp-filter {
  display: flex;
  width: 250px;
  height: 28px;
  align-items: center;
  gap: 8px;
  padding: 0 6px 0 9px;
  border-radius: 7px;
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
}
.jp-filter--sm {
  width: 190px;
}
.jp-filter kbd {
  margin-left: auto;
}
.jp-filter .jp-i {
  width: 14px;
  height: 14px;
}
.jp-count {
  font-size: 11.5px;
}
.jp-tool {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: hsl(var(--foreground) / 0.85);
}
.jp-count + .jp-tool {
  margin-left: auto;
}
.jp-tool .jp-i {
  width: 14px;
  height: 14px;
  color: hsl(var(--muted-foreground));
}

/* table */
.jp-table {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  font-size: 12px;
}
.jp-tr {
  position: relative;
  display: grid;
  grid-template-columns: 30px 92px minmax(0, 1fr) 46px 62px 140px 98px 98px 96px;
  align-items: center;
  height: 33px;
  padding: 0 10px;
  border-bottom: 1px solid hsl(var(--border-subtle));
  white-space: nowrap;
}
.jp-tr > span {
  overflow: hidden;
  text-overflow: ellipsis;
}
.jp-th {
  height: 32px;
  font-size: 11px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  border-bottom-color: hsl(var(--border));
}
.jp-check {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid hsl(var(--border-strong));
  opacity: 0;
}
.jp-th .jp-check,
.jp-tr.is-selected .jp-check {
  opacity: 1;
}
.c-name {
  font-weight: 500;
}
.c-ready,
.c-rs {
  text-align: right;
  padding-right: 10px;
  font-variant-numeric: tabular-nums;
}
.c-status {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-left: 6px;
}
.c-status b {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: hsl(var(--success));
}
.jp-th .c-status {
  padding-left: 6px;
}
.c-cpu,
.c-mem {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  padding-right: 12px;
  font-variant-numeric: tabular-nums;
}
.jp-th .c-cpu,
.jp-th .c-mem {
  justify-content: flex-end;
}
.c-cpu svg,
.c-mem svg {
  width: 40px;
  height: 14px;
  margin-right: auto;
  fill: none;
  stroke: hsl(var(--muted-foreground) / 0.7);
  stroke-width: 1.2;
  stroke-linejoin: round;
}
.c-cpu svg.hot,
.c-mem svg.hot {
  stroke: hsl(var(--warning));
}
.c-ip {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: hsl(var(--muted-foreground));
}
.jp-tr.is-bad .c-status {
  color: hsl(var(--destructive));
}
.jp-tr.is-bad .c-status b {
  background: hsl(var(--destructive));
}
.jp-tr.is-warn .c-status {
  color: hsl(var(--warning));
}
.jp-tr.is-warn .c-status b {
  background: hsl(var(--warning));
}
.jp-tr.is-done .c-status {
  color: hsl(var(--muted-foreground));
}
.jp-tr.is-done .c-status b {
  background: hsl(var(--muted-foreground) / 0.6);
}
.jp-tr.is-gone {
  opacity: 0.5;
}
.jp-tr.is-gone .c-status {
  color: hsl(var(--destructive));
}
.jp-tr.is-gone .c-status b {
  background: hsl(var(--destructive));
}
.jp-tr.is-selected {
  background: hsl(var(--accent) / 0.75);
  color: hsl(var(--accent-foreground));
}
.jp-tr.is-selected::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: hsl(var(--primary));
}

/* bottom panel */
.jp-panel {
  display: flex;
  height: 284px;
  flex-shrink: 0;
  border-top: 1px solid hsl(var(--border));
}
.jp-pane {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}
.jp-pane + .jp-pane {
  border-left: 1px solid hsl(var(--border));
}
.jp-tabbar {
  position: relative;
  display: flex;
  height: 34px;
  flex-shrink: 0;
  align-items: stretch;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--surface-1));
}
.jp-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border-right: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  font-size: 11.5px;
  margin-bottom: -1px;
}
.jp-tab .jp-i {
  width: 13px;
  height: 13px;
  color: hsl(var(--muted-foreground));
}
.jp-tab .jp-x {
  margin-left: 6px;
  width: 11px;
  height: 11px;
}
.jp-tab.is-current::before {
  content: "";
  position: absolute;
  inset: -1px 0 auto;
  height: 2px;
  background: hsl(var(--primary));
}
.jp-dot {
  width: 6px;
  height: 6px;
  margin-left: 4px;
  border-radius: 50%;
  background: hsl(var(--warning));
}
.jp-review {
  align-self: center;
  margin: 0 8px 0 auto;
  padding: 4px 10px;
  border-radius: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 11px;
  font-weight: 600;
}

.jp-term,
.jp-editor {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.62;
  white-space: pre;
  font-feature-settings: "calt" 0;
}
.jp-term {
  padding: 8px 12px;
  background: var(--term-background);
  color: var(--term-foreground);
}
.jp-ansi {
  display: flex;
  gap: 3px;
  padding: 2px 0;
}
.jp-ansi span {
  width: 22px;
  height: 11px;
  border-radius: 2px;
}
.jp-cursor {
  display: inline-block;
  width: 7px;
  height: 14px;
  vertical-align: -3px;
  background: var(--term-cursor);
  animation: caret 1.1s steps(1) infinite;
}
.jp-editor {
  padding: 6px 0;
  background: var(--ed-background);
  color: var(--ed-foreground);
}
.jp-editor p {
  padding-right: 8px;
}
.jp-editor p.is-active {
  background: var(--ed-lineHighlight);
}
.jp-ln {
  display: inline-block;
  width: 38px;
  padding-right: 14px;
  text-align: right;
  color: var(--ed-lineNumber);
}
.s-key {
  color: var(--syn-key);
}
.s-string {
  color: var(--syn-string);
}
.s-number {
  color: var(--syn-number);
}
.s-constant {
  color: var(--syn-constant);
}
.s-comment {
  color: var(--syn-comment);
  font-style: italic;
}
.s-punctuation {
  color: var(--syn-punctuation);
}
.s-text {
  color: var(--syn-text);
}
.jp-editor p.is-active .s-number {
  border-radius: 2px;
  background: var(--ed-selection);
}

/* ------------------------------------------------------------- graph */
.jp-ctx-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  color: hsl(var(--foreground));
  font-weight: 500;
}
.jp-problems em {
  font-style: normal;
  padding: 0 5px;
  border-radius: 4px;
  background: hsl(var(--destructive) / 0.14);
  color: hsl(var(--destructive));
  font-size: 10.5px;
}
.jp-health {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-size: 11.5px;
}
.jp-health strong {
  color: hsl(var(--foreground));
}
.jp-health i,
.jp-app-title i,
.jp-node > i,
.jp-legend b {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
}
.jp-health i:first-of-type {
  margin-left: 6px;
}
.ok {
  background: hsl(var(--success));
}
.warn {
  background: hsl(var(--warning));
}
.bad {
  background: hsl(var(--destructive));
}
.jp-graph {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 14px 18px;
  background-image: radial-gradient(hsl(var(--border-strong) / 0.55) 1px, transparent 1px);
  background-size: 16px 16px;
  overflow: hidden;
}
.jp-lane-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}
.jp-lane-title .jp-i {
  width: 13px;
  height: 13px;
}
.jp-lane {
  display: flex;
  gap: 14px;
}
.jp-app {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px 12px;
  border-radius: 10px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--surface-2) / 0.85);
}
.jp-app.is-warn {
  border-top: 2px solid hsl(var(--warning));
}
.jp-app.is-bad {
  border-top: 2px solid hsl(var(--destructive));
}
.jp-app-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  font-size: 12px;
}
.jp-app-title span {
  margin-left: auto;
  padding-left: 16px;
  font-size: 10.5px;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
}
.jp-app.is-warn .jp-app-title span {
  color: hsl(var(--warning));
}
.jp-app.is-bad .jp-app-title span {
  color: hsl(var(--destructive));
}
.jp-flow {
  display: flex;
  align-items: center;
}
.jp-flow--side {
  gap: 10px;
}
.jp-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 184px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--surface-3));
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}
.jp-node--sm {
  width: 164px;
}
.jp-node > span:nth-child(2) {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}
.jp-node strong {
  overflow: hidden;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.jp-node small {
  overflow: hidden;
  font-size: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: hsl(var(--muted-foreground));
}
.jp-node-icon {
  display: inline-flex;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: hsl(var(--primary) / 0.12);
  color: hsl(var(--primary));
}
.jp-node-icon .jp-i {
  width: 14px;
  height: 14px;
}
.jp-node.is-focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 3px hsl(var(--ring) / 0.2);
}
.jp-pods {
  position: absolute;
  left: 10px;
  bottom: -6px;
  display: flex;
  gap: 3px;
}
.jp-pods b {
  width: 9px;
  height: 5px;
  border-radius: 2px;
}
.jp-node.is-missing {
  border: 1px dashed hsl(var(--destructive) / 0.7);
  background: hsl(var(--destructive) / 0.08);
}
.jp-node.is-missing strong {
  color: hsl(var(--destructive));
}
.jp-node.is-missing .jp-node-icon {
  background: hsl(var(--destructive) / 0.12);
  color: hsl(var(--destructive));
}
.jp-node em {
  font-style: normal;
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid hsl(var(--destructive) / 0.5);
  color: hsl(var(--destructive));
}
.jp-edge {
  width: 30px;
  height: 0;
  border-top: 1.5px solid hsl(var(--info));
  position: relative;
}
.jp-edge::after {
  content: "";
  position: absolute;
  right: -1px;
  top: -4.5px;
  border: 4px solid transparent;
  border-left-color: hsl(var(--info));
  border-right-width: 0;
}
.jp-edge--uses {
  border-top: 1.5px dashed hsl(var(--muted-foreground) / 0.8);
}
.jp-edge--uses::after {
  border-left-color: hsl(var(--muted-foreground) / 0.8);
}
.jp-edge--missing {
  border-top: 1.5px dashed hsl(var(--destructive));
}
.jp-edge--missing::after {
  border-left-color: hsl(var(--destructive));
}
.jp-legend {
  position: absolute;
  left: 18px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--surface-3));
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  box-shadow: 0 6px 20px -8px rgb(0 0 0 / 0.3);
}
.jp-legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.jp-legend i {
  width: 18px;
  height: 0;
  border-top: 1.5px solid hsl(var(--info));
}
.jp-legend .l-owns {
  border-top-color: hsl(var(--muted-foreground));
}
.jp-legend .l-uses {
  border-top: 1.5px dashed hsl(var(--muted-foreground));
}
.jp-legend .l-missing {
  border-top: 1.5px dashed hsl(var(--destructive));
}

/* ------------------------------------------------------ compact layout */
@media (max-width: 639px) {
  .jp-side {
    display: none;
  }
  .jp-main {
    margin: 8px;
  }
  .jp-tr {
    grid-template-columns: 0 0 minmax(0, 1fr) 0 0 128px 78px 0 0;
    padding: 0 12px;
  }
  .jp-tr > .c-ns,
  .jp-tr > .c-ready,
  .jp-tr > .c-rs,
  .jp-tr > .c-mem,
  .jp-tr > .c-ip,
  .jp-tr > .jp-check {
    visibility: hidden;
  }
  .jp-tool,
  .jp-health {
    display: none;
  }
  .jp-filter {
    width: 200px;
  }
  .c-cpu svg {
    display: none;
  }
  .jp-panel {
    height: 500px;
    flex-direction: column;
  }
  .jp-pane + .jp-pane {
    border-left: 0;
    border-top: 1px solid hsl(var(--border));
  }
  .jp-lane,
  .jp-lane--two {
    flex-direction: column;
  }
  .jp-flow {
    flex-wrap: wrap;
    row-gap: 10px;
  }
  .jp-node {
    width: 190px;
  }
  .jp-edge {
    width: 14px;
  }
  .jp-flow--side,
  .jp-legend {
    display: none;
  }
}
</style>
