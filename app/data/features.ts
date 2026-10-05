/*
 * Every JET Pilot feature on the homepage, in one place.
 *
 * Curation rule: the tour (tier "tour") holds at most 6 features, the ones
 * that set JET Pilot apart. Promoting a feature to the tour means demoting
 * another one to "more" (the compact "Everything else" grid). Give a feature
 * a `shot` (a name under public/images/app/) when you have one, so promoting
 * it is a one-line change.
 *
 * "New" badges are never placed by hand: a feature is new while its `since`
 * has the same major version as the newest feature on this list.
 *
 * Themes have their own homepage section and page (ThemesTeaser, /themes/).
 */

export interface Feature {
  /** Also the anchor: /#graph selects the graph in the tour. */
  id: string;
  title: string;
  /** One line. */
  lead: string;
  /** Tour only: up to three short facts under the screenshot (HTML allowed). */
  points?: string[];
  /** Screenshot name in public/images/app/, without theme and size. */
  shot?: string;
  /** Crop into the screenshot: scale factor and transform-origin. */
  zoom?: number;
  focus?: string;
  alt?: string;
  icon: string;
  tier: "tour" | "more";
  /** The release a feature first shipped in (or was rebuilt in). */
  since: string;
}

export const features: Feature[] = [
  /* ---------------------------------------------------------------- tour -- */
  {
    id: "clusters",
    title: "Clusters hub",
    lead: "Every cluster you have, named, sorted and checked.",
    points: ["Every context of every kubeconfig and cloud", "Names, colours, folders and favourites", "Live status that never starts a sign-in"],
    shot: "clusters-hub",
    zoom: 1.2,
    focus: "100% 0%",
    alt: "The Clusters hub: clusters in favourites and folders with environment badges, versions and statuses, and the details panel of Checkout, a protected production GKE cluster",
    icon: "server",
    tier: "tour",
    since: "2.0.0",
  },
  {
    id: "clouds",
    title: "Every cloud",
    lead: "Nine clouds, connected right in the app.",
    points: ["AWS, Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale", "Every account, project and region", "Credentials in your keychain"],
    shot: "add-cloud",
    zoom: 1.45,
    focus: "50% 45%",
    alt: "The Add a cluster dialog: nine clouds (AWS, Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale) above options to paste a kubeconfig, import a file or enter a cluster by hand",
    icon: "cloud",
    tier: "tour",
    since: "2.0.0",
  },
  {
    id: "live",
    title: "Live tables",
    lead: "Straight from the API server. No polling.",
    points: ["A scale lands on screen in about 200 ms", "CPU and memory sparklines for every pod", "A 2,000-pod snapshot in about 0.7 s"],
    shot: "live",
    zoom: 1.55,
    focus: "68% 0%",
    alt: "The pods table with CPU and memory sparkline columns next to each pod's status",
    icon: "zap",
    tier: "tour",
    since: "1.37.0",
  },
  {
    id: "graph",
    title: "Resource graph",
    lead: "Every app mapped. What’s broken, first.",
    points: ["Ingress → Service → workload → Pods, per app", "Missing references as red dashed nodes", "<kbd>P</kbd> shows only the problems"],
    shot: "graph",
    zoom: 1.2,
    focus: "100% 0%",
    alt: "The resource graph with the checkout-api Deployment selected: its Service, PodDisruptionBudget and ConfigMap highlighted along the path, and a side panel listing its pods, relationships and replica status",
    icon: "graph",
    tier: "tour",
    since: "1.37.0",
  },
  {
    id: "logs",
    title: "Logs across pods",
    lead: "Every pod of a workload in one stream.",
    points: ["Colour-coded per pod", "JSON parsed into fields you can filter on", "Search, pause and export"],
    shot: "logs",
    zoom: 1.3,
    focus: "70% 100%",
    alt: "Logs for the payments-api Deployment: four pods listed with their own colours, container and field filters, and interleaved log lines prefixed with the pod and container they came from",
    icon: "logs",
    tier: "tour",
    since: "1.37.0",
  },
  {
    id: "command-palette",
    title: "Command palette",
    lead: "Everything is a keystroke away.",
    points: ["<kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> for resources, settings and clusters", "k9s-style keys: <kbd>l</kbd> logs, <kbd>s</kbd> shell, <kbd>e</kbd> edit", "<kbd>?</kbd> shows every shortcut"],
    shot: "command-palette",
    zoom: 1.25,
    focus: "45% 25%",
    alt: "The command palette open over the pods table, listing actions such as Switch workspace, Open terminal, Switch context, Change a setting and Add cluster",
    icon: "command",
    tier: "tour",
    since: "1.2.0",
  },

  /* ---------------------------------------------------------------- more -- */
  {
    id: "multi-cluster",
    title: "Several clusters, one table",
    lead: "Pick contexts and namespaces from one switcher; tables merge them, with a Context column.",
    shot: "context-switcher",
    zoom: 1.5,
    focus: "0% 0%",
    alt: "The context switcher open with two active contexts, prod-eu-west-1 and staging-us-east-2, each with the payments and checkout namespaces selected",
    icon: "layers",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "sign-in",
    title: "Sign in, in the app",
    lead: "Device codes show up in JET Pilot, and your views, logs and port forwards reconnect.",
    shot: "sign-in",
    zoom: 1.6,
    focus: "50% 50%",
    alt: "Signing in to AWS inside JET Pilot: the device code QXRW-PLMK, the verification address device.sso.eu-west-1.amazonaws.com and an Open browser button",
    icon: "logIn",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "guardrails",
    title: "Production guardrails",
    lead: "Type the name before anything destructive, or make a cluster read-only.",
    icon: "shield",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "credentials",
    title: "Keychain credentials",
    lead: "Tokens and keys stay in your system keychain, and added clusters work in kubectl and k9s.",
    icon: "key",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "add-cluster",
    title: "Paste, import or type",
    lead: "Add clusters from a kubeconfig, or by hand with a token or client certificate.",
    icon: "filePlus",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "setup",
    title: "A guided first launch",
    lead: "Finds your kubeconfig files and tools, and connects your clouds in a few steps.",
    icon: "compass",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "workspaces",
    title: "Workspaces",
    lead: "Save contexts, tabs and port forwards, switch in one keystroke, and split two tabs side by side.",
    shot: "workspaces",
    zoom: 1.15,
    focus: "0% 45%",
    alt: "The workspace switcher listing Payments on-call, Checkout incident, Staging rollout and Platform & ingress with their shortcuts, above a split view of a describe tab and a logs tab",
    icon: "columns",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "editor",
    title: "Review before you apply",
    lead: "YAML with your cluster’s own schemas, then a diff and a server-side dry run.",
    shot: "editor",
    zoom: 1.2,
    focus: "95% 100%",
    alt: "Reviewing changes to the payments-api Deployment: a side-by-side diff with replicas changed from 4 to 6 and a new image tag, and a “Server dry run passed” status next to the Apply button",
    icon: "code",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "workloads",
    title: "Roll out, roll back",
    lead: "Rollout history with a diff per revision, pause, restart and a safe rollback.",
    shot: "rollouts",
    zoom: 1.2,
    focus: "95% 100%",
    alt: "Rollout history for the payments-api Deployment: a list of revisions with their change causes and images, and a diff between the current revision and r6 with a “Roll back to r6” button",
    icon: "refresh",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "helm",
    title: "Helm releases",
    lead: "Upgrade with a values diff, read the history, roll back or uninstall.",
    icon: "anchor",
    tier: "more",
    since: "1.30.0",
  },
  {
    id: "terminal",
    title: "Built-in terminal",
    lead: "Ctrl+` opens kubectl on the current context, without touching your kubeconfig.",
    shot: "terminal",
    zoom: 1.3,
    focus: "0% 100%",
    alt: "The built-in terminal panel below the pods table, opened for prod-eu-west-1 with a note that KUBECONFIG points to a temporary copy",
    icon: "terminal",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "debug",
    title: "Shells and debugging",
    lead: "Shells into any container, ephemeral debug containers, node shells and file copies.",
    icon: "bug",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "port-forwards",
    title: "Port forwards",
    lead: "Start, stop and open forwards, or save profiles that start with the app.",
    icon: "plug",
    tier: "more",
    since: "1.29.0",
  },
  {
    id: "details",
    title: "Details at a click",
    lead: "Containers, conditions, labels and events in a side panel, or the full describe.",
    shot: "side-panel",
    zoom: 1.3,
    focus: "100% 0%",
    alt: "The pods table with the side panel open on a crash-looping pod: its container, conditions, labels and annotations",
    icon: "panelRight",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "settings",
    title: "Settings you can search",
    lead: "Every preference in one searchable place, or as settings.json with validation.",
    icon: "sliders",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "hardened",
    title: "Hardened by default",
    lead: "A strict content security policy, minimal permissions, and Secrets that stay in memory.",
    icon: "lock",
    tier: "more",
    since: "1.36.0",
  },
];

const major = (version: string) => Number.parseInt(version, 10) || 0;

/** The newest major version on the list: its features carry a "New" badge. */
export const currentMajor = Math.max(...features.map((f) => major(f.since)));

export const isNew = (feature: Feature) => major(feature.since) === currentMajor;

export const MAX_TOUR = 6;
export const tourFeatures = features.filter((f) => f.tier === "tour" && f.shot).slice(0, MAX_TOUR);
export const moreFeatures = features.filter((f) => f.tier === "more" || !tourFeatures.includes(f));

if (import.meta.dev && features.filter((f) => f.tier === "tour").length > MAX_TOUR) {
  console.warn(`features.ts: the tour holds at most ${MAX_TOUR} features; demote one to "more".`);
}
