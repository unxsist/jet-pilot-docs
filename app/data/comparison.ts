/*
 * The /compare/ table. Every competitor cell comes from the project's own
 * site, docs, source or release assets (see `sources` below). A cell we
 * couldn't confirm is `unknown` and shows a dash: no claim either way.
 * Re-check everything (prices and sizes especially) when updating CHECKED.
 */

export const CHECKED = "October 2026";

export const TOOLS = [
  { id: "jet", name: "JET Pilot" },
  { id: "lens", name: "Lens" },
  { id: "freelens", name: "Freelens" },
  { id: "headlamp", name: "Headlamp" },
  { id: "k9s", name: "k9s" },
  { id: "aptakube", name: "Aptakube" },
] as const;

export type ToolId = (typeof TOOLS)[number]["id"];

export type Cell =
  | { kind: "yes"; note?: string }
  | { kind: "no"; note?: string }
  | { kind: "text"; text: string; note?: string }
  | { kind: "unknown" }
  | { kind: "na" };

const yes = (note?: string): Cell => ({ kind: "yes", note });
const no = (note?: string): Cell => ({ kind: "no", note });
const text = (value: string, note?: string): Cell => ({ kind: "text", text: value, note });
const unknown: Cell = { kind: "unknown" };
const na: Cell = { kind: "na" };

export interface Row {
  label: string;
  cells: Record<ToolId, Cell>;
}

export interface RowGroup {
  title: string;
  rows: Row[];
}

export const GROUPS: RowGroup[] = [
  {
    title: "The basics",
    rows: [
      {
        label: "Price",
        cells: {
          jet: text("Free"),
          lens: text("Free under $10M company revenue or funding", "Paid plans from $25 per user per month"),
          freelens: text("Free"),
          headlamp: text("Free"),
          k9s: text("Free"),
          aptakube: text("Free for clusters up to 5 nodes", "Paid plans from €7 per month"),
        },
      },
      {
        label: "Open source",
        cells: { jet: yes("MIT"), lens: no(), freelens: yes("MIT"), headlamp: yes("Apache-2.0"), k9s: yes("Apache-2.0"), aptakube: no() },
      },
      {
        label: "Account needed",
        cells: {
          jet: text("No"),
          lens: text("Yes", "A Lens ID"),
          freelens: text("No"),
          headlamp: text("No"),
          k9s: text("No"),
          aptakube: text("No", "A licence key for larger clusters"),
        },
      },
      {
        label: "Interface",
        cells: {
          jet: text("Desktop app"),
          lens: text("Desktop app"),
          freelens: text("Desktop app"),
          headlamp: text("Desktop app or in-cluster web UI"),
          k9s: text("Terminal"),
          aptakube: text("Desktop app"),
        },
      },
      {
        label: "Built with",
        cells: {
          jet: text("Rust and Tauri"),
          lens: text("Electron"),
          freelens: text("Electron"),
          headlamp: text("Go and Electron"),
          k9s: text("Go"),
          aptakube: text("Tauri"),
        },
      },
      {
        label: "macOS download",
        cells: {
          jet: text("26 MB"),
          lens: text("274 MB"),
          freelens: text("190 MB"),
          headlamp: text("137 MB"),
          k9s: text("37 MB", "Single binary"),
          aptakube: text("32 MB"),
        },
      },
      {
        label: "Windows on ARM",
        cells: { jet: no(), lens: no(), freelens: yes(), headlamp: yes(), k9s: yes(), aptakube: no() },
      },
      {
        label: "Signed and notarized on macOS",
        cells: { jet: no(), lens: yes(), freelens: yes(), headlamp: yes(), k9s: na, aptakube: yes() },
      },
    ],
  },
  {
    title: "Clusters",
    rows: [
      {
        label: "Several clusters in one table",
        cells: { jet: yes(), lens: unknown, freelens: no(), headlamp: yes(), k9s: no(), aptakube: yes() },
      },
      {
        label: "Finds clusters in your cloud accounts",
        cells: {
          jet: yes("AWS, Google Cloud, Azure and six more"),
          lens: yes("EKS, AKS and GKE, on paid plans"),
          freelens: unknown,
          headlamp: unknown,
          k9s: no(),
          aptakube: no(),
        },
      },
      {
        label: "Production guardrails",
        cells: {
          jet: yes("Protected and read-only clusters"),
          lens: no(),
          freelens: no(),
          headlamp: text("Follows cluster RBAC"),
          k9s: yes("Read-only mode"),
          aptakube: no(),
        },
      },
    ],
  },
  {
    title: "Features",
    rows: [
      {
        label: "Resource graph",
        cells: {
          jet: yes(),
          lens: text("Via extension", "Community extension; extensions need a paid plan"),
          freelens: text("Via extension"),
          headlamp: yes("Map view"),
          k9s: yes("XRay tree"),
          aptakube: unknown,
        },
      },
      {
        label: "Built-in terminal and container shell",
        cells: { jet: yes(), lens: yes(), freelens: yes(), headlamp: yes(), k9s: yes(), aptakube: yes() },
      },
      {
        label: "Helm",
        cells: { jet: yes(), lens: yes(), freelens: yes(), headlamp: yes(), k9s: yes(), aptakube: yes() },
      },
      {
        label: "Prometheus metrics",
        cells: { jet: yes("Finds Prometheus by itself"), lens: yes(), freelens: yes(), headlamp: yes("Plugin"), k9s: no(), aptakube: yes() },
      },
      {
        label: "Flux and Argo CD views",
        cells: {
          jet: yes(),
          lens: yes("On paid plans"),
          freelens: text("Flux via extension"),
          headlamp: yes("Plugins"),
          k9s: text("Via plugins"),
          aptakube: yes(),
        },
      },
      {
        label: "Plugins or extensions",
        cells: {
          jet: no("Custom actions from YAML files"),
          lens: yes("Marketplace, on paid plans"),
          freelens: yes(),
          headlamp: yes("Plugin catalog"),
          k9s: yes(),
          aptakube: unknown,
        },
      },
      {
        label: "AI assistant",
        cells: {
          jet: no(),
          lens: yes("On paid plans"),
          freelens: text("Via extension"),
          headlamp: yes("Plugin"),
          k9s: no(),
          aptakube: unknown,
        },
      },
      {
        label: "Runs in the cluster for a team",
        cells: { jet: no(), lens: no(), freelens: no(), headlamp: yes(), k9s: no(), aptakube: no() },
      },
      {
        label: "Works over SSH",
        cells: { jet: no(), lens: no(), freelens: no(), headlamp: no(), k9s: yes(), aptakube: no() },
      },
    ],
  },
];

/* Where the cells come from, per tool. */
export const SOURCES: { tool: string; links: { label: string; href: string }[] }[] = [
  {
    tool: "Lens",
    links: [
      { label: "Pricing", href: "https://lenshq.io/pricing" },
      { label: "Activating Lens Desktop (Lens ID)", href: "https://docs.lenshq.io/k8slens/getting-started/activate-lens-desktop/" },
      { label: "Release notes 2026.10", href: "https://docs.lenshq.io/release-notes/lens-k8s-ide/lens-2026-10-51501/" },
      { label: "Windows installer feed", href: "https://downloads.k8slens.dev/ide/latest.yml" },
      { label: "Cluster settings", href: "https://docs.lenshq.io/k8slens/cluster/cluster-settings/" },
      { label: "Flux", href: "https://docs.lenshq.io/k8slens/flux-cd/" },
      { label: "Argo CD", href: "https://docs.lenshq.io/k8slens/argo-cd/" },
      { label: "Extensions marketplace", href: "https://docs.lenshq.io/k8slens/extensions/marketplace/" },
      { label: "Resource map extension", href: "https://github.com/nevalla/lens-resource-map-extension" },
    ],
  },
  {
    tool: "Freelens",
    links: [
      { label: "README", href: "https://github.com/freelensapp/freelens" },
      { label: "Release v1.10.3", href: "https://github.com/freelensapp/freelens/releases/tag/v1.10.3" },
      { label: "Flux extension", href: "https://github.com/freelensapp/freelens-fluxcd-extension" },
      { label: "Resource map extension", href: "https://github.com/freelensapp/freelens-resource-map-extension" },
      { label: "AI extension", href: "https://github.com/freelensapp/freelens-ai-extension" },
    ],
  },
  {
    tool: "Headlamp",
    links: [
      { label: "headlamp.dev", href: "https://headlamp.dev/" },
      { label: "Release v0.45.0", href: "https://github.com/kubernetes-sigs/headlamp/releases/tag/v0.45.0" },
      { label: "Headlamp in 2025", href: "https://kubernetes.io/blog/2026/01/22/headlamp-in-2025-project-highlights/" },
      { label: "From Kubernetes Dashboard to Headlamp", href: "https://kubernetes.io/blog/2026/06/01/dashboard-to-headlamp/" },
    ],
  },
  {
    tool: "k9s",
    links: [
      { label: "README", href: "https://github.com/derailed/k9s#readme" },
      { label: "Releases", href: "https://github.com/derailed/k9s/releases/latest" },
      { label: "Plugins", href: "https://github.com/derailed/k9s/tree/master/plugins" },
    ],
  },
  {
    tool: "Aptakube",
    links: [
      { label: "aptakube.com", href: "https://aptakube.com/" },
      { label: "Pricing", href: "https://aptakube.com/pricing" },
      { label: "Contexts", href: "https://aptakube.com/docs/contexts" },
      { label: "Release notes", href: "https://github.com/aptakube/aptakube/releases" },
    ],
  },
  {
    tool: "Signing",
    links: [
      { label: "Homebrew casks, which require a passing Gatekeeper check", href: "https://formulae.brew.sh/cask/" },
    ],
  },
];

/* The page's FAQ, also published as FAQPage structured data. HTML answers. */
export const COMPARE_FAQS = [
  {
    q: "What is a good free alternative to Lens?",
    a: `JET Pilot is free and open source (MIT) and needs no account, for personal and company use alike. Freelens, an open-source continuation of the Lens interface, and Headlamp are free too. Lens itself is free for individuals and organisations under $10 million in revenue or funding, and requires a Lens ID.`,
  },
  {
    q: "Is there a Lens alternative that doesn’t need an account?",
    a: `Yes. JET Pilot, Freelens, Headlamp and k9s all work without signing up. JET Pilot uses your existing kubeconfig files and, if you want, your cloud accounts’ own sign-in.`,
  },
  {
    q: "What happened to OpenLens, and what should I use instead?",
    a: `OpenLens was a build of Lens’s open-source core. When Lens closed its source in 2023, OpenLens stopped receiving updates; its last release is from June 2023. Freelens continues that codebase. JET Pilot is a separate, newer client built from scratch with Rust and Tauri.`,
  },
  {
    q: "What is the best Kubernetes desktop client for Mac?",
    a: `It depends on how you work. JET Pilot runs natively on Apple Silicon and Intel Macs, is a 26 MB download and installs with <code>brew install --cask unxsist/tap/jet-pilot</code>. k9s suits terminal users; Lens, Freelens and Headlamp are larger Electron apps with plugin ecosystems.`,
  },
  {
    q: "Is there a free Kubernetes GUI for Windows and Linux?",
    a: `JET Pilot runs on Windows (x64, a 15 MB installer) and Linux (x64 and ARM64, as <code>.deb</code>, <code>.rpm</code> or AppImage). Freelens and Headlamp are also free on both.`,
  },
  {
    q: "Kubernetes Dashboard is archived. What now?",
    a: `Kubernetes Dashboard was retired in January 2026. If you want a web UI inside the cluster, the Kubernetes project recommends Headlamp. If you want a desktop app on your own machine, JET Pilot works with any cluster you can reach through a kubeconfig or cloud account, and installs nothing in the cluster.`,
  },
  {
    q: "Can I see several clusters at once?",
    a: `Yes. Select several contexts and namespaces and JET Pilot’s tables combine them, with Context and Namespace columns so you know where each resource lives.`,
  },
  {
    q: "Does JET Pilot replace kubectl or k9s?",
    a: `No, it works alongside them. It uses <code>kubectl</code> for its terminal, and clusters you add in JET Pilot work in <code>kubectl</code> and <code>k9s</code> through its own kubeconfig.`,
  },
  {
    q: "Does JET Pilot collect any data?",
    a: `No. There is no account, no analytics and no telemetry. It talks to your clusters and the cloud accounts you connect, checks for updates and fetches its own announcements feed. Open VSX and Artifact Hub are only contacted while you browse themes or search for Helm charts.`,
  },
];
