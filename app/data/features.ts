/*
 * Every JET Pilot feature on the homepage, in one place.
 *
 * Curation rule: the showcase (tier "showcase") holds at most 6 features,
 * the ones that set JET Pilot apart. Each one gets a full-width moment: a
 * close-up ("macro") of its screenshot, or with `wide: true` the whole window.
 * Promoting a feature to the showcase means demoting another one to "more"
 * (the compact contact sheet below it). Give a feature a `shot` (a name under
 * public/images/app/) and a `crop` when you have one, so promoting it is a
 * one-line change.
 *
 * "New" badges are never placed by hand: a feature is new while its `since`
 * has the same major version as the newest feature on this list.
 *
 * Themes have their own homepage section and page (ThemesTeaser, /themes/).
 */

/**
 * A close-up of a 1440 × 900 screenshot.
 * - `zoom`: the screenshot's width as a multiple of the frame's width
 *   (the viewport for a showcase macro, the thumbnail for the contact sheet).
 * - `focus`: the point of interest, as fractions of the screenshot's width
 *   and height. It is placed where the layout wants it (the open side of a
 *   macro, the middle of a thumbnail), without ever showing past the edge.
 */
export interface Crop {
  zoom: number;
  focus: [x: number, y: number];
  /**
   * Showcase macros on wide screens: where the picture fades in from the
   * words' side, as fractions of the frame measured from that side (default
   * [0.47, 0.55]). Tighten it to cut a stray element close to the subject.
   */
  clear?: [from: number, to: number];
}

export interface Feature {
  /** Also the anchor: /#graph scrolls to the graph. */
  id: string;
  /** Showcase: two to five words. */
  title: string;
  /** One sentence. */
  lead: string;
  /** Showcase only: up to three short facts (HTML allowed). */
  points?: string[];
  /** Screenshot name in public/images/app/, without theme and size. */
  shot?: string;
  alt?: string;
  /** The close-up: a showcase macro, or a contact-sheet thumbnail. */
  crop?: Crop & {
    /** Showcase, below 768 px: the tall crop that fills a phone's width. */
    mobile?: Crop;
    /** Showcase macros, 768–1023 px, under the words: defaults to `mobile`. */
    tablet?: Crop;
  };
  /** Showcase only: pull back and show the whole window (phones still get the crop). */
  wide?: boolean;
  /** Showcase macros only: which side the words go; alternates by default. */
  side?: "left" | "right";
  tier: "showcase" | "more";
  /** The release a feature first shipped in (or was rebuilt in). */
  since: string;
}

export const features: Feature[] = [
  /* ------------------------------------------------------------ showcase -- */
  {
    id: "clusters",
    title: "Every cluster, one hub.",
    lead: "Every cluster from every kubeconfig and cloud account, named, sorted and checked, a keystroke away.",
    points: ["Names, colours, folders and tags", "Status, version and sign-in at a click", "Open it with <kbd>⌘O</kbd> or <kbd>Ctrl+O</kbd>"],
    shot: "clusters-hub",
    crop: { zoom: 1.75, focus: [0.81, 0.446], clear: [0.54, 0.56], mobile: { zoom: 3.6, focus: [0.83, 0.42] }, tablet: { zoom: 3, focus: [0.83, 0.36] } },
    alt: "The Clusters hub: clusters in favourites and folders with environment badges, versions and statuses, and the details panel of Checkout, a protected production GKE cluster",
    tier: "showcase",
    since: "2.0.0",
  },
  {
    id: "clouds",
    title: "Nine clouds, built in.",
    lead: "Connect an account and JET Pilot finds its clusters, and keeps the list current.",
    points: [
      "AWS, Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale",
      "Or paste, import or type a kubeconfig",
      "Credentials in your system keychain",
    ],
    shot: "add-cloud",
    crop: { zoom: 1.4, focus: [0.5, 0.42], mobile: { zoom: 2.5, focus: [0.5, 0.42] } },
    wide: true,
    alt: "The Add a cluster dialog: nine clouds (AWS, Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale) above options to paste a kubeconfig, import a file or enter a cluster by hand",
    tier: "showcase",
    since: "2.0.0",
  },
  {
    id: "sign-in",
    title: "Sign in, in the app.",
    lead: "Device codes and browser sign-ins for kubelogin, gcloud, az, AWS and OIDC plugins appear right in JET Pilot.",
    points: ["Lists, logs and port forwards reconnect", "Nothing opens a browser on its own"],
    shot: "sign-in",
    crop: { zoom: 2.2, focus: [0.5, 0.515], mobile: { zoom: 2.6, focus: [0.5, 0.49] } },
    alt: "Signing in to AWS inside JET Pilot: the device code QXRW-PLMK, the verification address device.sso.eu-west-1.amazonaws.com and an Open browser button",
    tier: "showcase",
    since: "2.0.0",
  },
  {
    id: "live",
    title: "Live, not polled.",
    lead: "Tables stream changes straight from the API server, so a scale lands on screen in about 200\u00a0ms.",
    points: ["CPU and memory sparklines for every pod", "A 2,000-pod snapshot in about 0.7\u00a0s"],
    shot: "live",
    crop: { zoom: 2, focus: [0.765, 0.42], clear: [0.5, 0.53], mobile: { zoom: 2.7, focus: [0.7, 0.42] } },
    alt: "The pods table with CPU and memory sparkline columns next to each pod's status",
    tier: "showcase",
    since: "1.37.0",
  },
  {
    id: "logs",
    title: "Every pod. One stream.",
    lead: "Open logs on a Deployment, StatefulSet, DaemonSet, Job or Service and follow all of its pods at once.",
    points: ["Colour-coded per pod", "JSON parsed into fields you can filter on", "Search, pause and export"],
    shot: "logs",
    crop: { zoom: 1.4, focus: [0.5, 0.6], mobile: { zoom: 2.8, focus: [0.42, 0.62] } },
    wide: true,
    alt: "Logs for the payments-api Deployment: four pods listed with their own colours, container and field filters, and interleaved log lines prefixed with the pod and container they came from",
    tier: "showcase",
    since: "1.37.0",
  },
  {
    id: "graph",
    title: "What’s broken, first.",
    lead: "Every app gets its own lane, from Ingress to Service to Pods, and health rolls up from pods to apps.",
    points: ["Missing references as red dashed nodes", "<kbd>P</kbd> shows only the problems"],
    shot: "graph",
    crop: { zoom: 1.45, focus: [0.385, 0.56], mobile: { zoom: 3, focus: [0.38, 0.57] } },
    alt: "The resource graph with the checkout-api Deployment selected: its Service, PodDisruptionBudget and ConfigMap highlighted along the path, and a side panel listing its pods, relationships and replica status",
    tier: "showcase",
    since: "1.37.0",
  },

  /* ---------------------------------------------------------------- more -- */
  {
    id: "command-palette",
    title: "Command palette",
    lead: "⌘K or Ctrl+K for resources, settings and clusters, and k9s-style keys for the rest.",
    shot: "command-palette",
    crop: { zoom: 3.3, focus: [0.43, 0.3] },
    alt: "The command palette open over the pods table, listing actions such as Switch workspace, Open terminal, Switch context, Change a setting and Add cluster",
    tier: "more",
    since: "1.2.0",
  },
  {
    id: "multi-cluster",
    title: "Several clusters, one table",
    lead: "Pick contexts and namespaces from one switcher; tables merge them, with a Context column.",
    shot: "context-switcher",
    crop: { zoom: 3.4, focus: [0.33, 0.2] },
    alt: "The context switcher open with two active contexts, prod-eu-west-1 and staging-us-east-2, each with the payments and checkout namespaces selected",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "workspaces",
    title: "Workspaces",
    lead: "Save contexts, tabs and port forwards, switch in one keystroke, and split two tabs side by side.",
    shot: "workspaces",
    crop: { zoom: 3.3, focus: [0.27, 0.27] },
    alt: "The workspace switcher listing Payments on-call, Checkout incident, Staging rollout and Platform & ingress with their shortcuts",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "editor",
    title: "Review before you apply",
    lead: "YAML with your cluster’s own schemas, then a diff and a server-side dry run.",
    shot: "editor",
    crop: { zoom: 4.4, focus: [0.89, 0.31] },
    alt: "Reviewing changes to the payments-api Deployment: a side-by-side diff with replicas changed from 4 to 6, and a “Server dry run passed” status next to the Apply button",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "workloads",
    title: "Roll out, roll back",
    lead: "Rollout history with a diff per revision, pause, restart and a safe rollback.",
    shot: "rollouts",
    crop: { zoom: 4.4, focus: [0.268, 0.42] },
    alt: "Rollout history for the payments-api Deployment: revisions with their change causes, and a diff between the current revision and r6 with a “Roll back to r6” button",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "details",
    title: "Details at a click",
    lead: "Containers, conditions, labels and events in a side panel, or the full describe.",
    shot: "side-panel",
    crop: { zoom: 3.6, focus: [0.87, 0.225] },
    alt: "The side panel open on a crash-looping pod: its container, conditions and labels",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "terminal",
    title: "Built-in terminal",
    lead: "Ctrl+` opens kubectl on the current context, without touching your kubeconfig.",
    shot: "terminal",
    crop: { zoom: 3.2, focus: [0.3, 0.73] },
    alt: "The built-in terminal panel below the pods table, opened for prod-eu-west-1 with a note that KUBECONFIG points to a temporary copy",
    tier: "more",
    since: "1.36.0",
  },
  {
    id: "guardrails",
    title: "Production guardrails",
    lead: "Type the name before anything destructive, or make a cluster read-only.",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "credentials",
    title: "Keychain credentials",
    lead: "Tokens and keys stay in your system keychain, and added clusters work in kubectl and k9s.",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "add-cluster",
    title: "Paste, import or type",
    lead: "Add clusters from a kubeconfig, or by hand with a token or client certificate.",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "setup",
    title: "A guided first launch",
    lead: "Finds your kubeconfig files and tools, and connects your clouds in a few steps.",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "settings",
    title: "Settings you can search",
    lead: "Every preference in one searchable place, or as settings.json with validation.",
    tier: "more",
    since: "2.0.0",
  },
  {
    id: "helm",
    title: "Helm releases",
    lead: "Upgrade with a values diff, read the history, roll back or uninstall.",
    tier: "more",
    since: "1.30.0",
  },
  {
    id: "debug",
    title: "Shells and debugging",
    lead: "Shells into any container, ephemeral debug containers, node shells and file copies.",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "port-forwards",
    title: "Port forwards",
    lead: "Start, stop and open forwards, or save profiles that start with the app.",
    tier: "more",
    since: "1.29.0",
  },
  {
    id: "hardened",
    title: "Hardened by default",
    lead: "A strict content security policy, minimal permissions, and Secrets that stay in memory.",
    tier: "more",
    since: "1.36.0",
  },
];

const major = (version: string) => Number.parseInt(version, 10) || 0;

/** The newest major version on the list: its features carry a "New" badge. */
export const currentMajor = Math.max(...features.map((f) => major(f.since)));

export const isNew = (feature: Feature) => major(feature.since) === currentMajor;

export const MAX_SHOWCASE = 6;
export const showcaseFeatures = features.filter((f) => f.tier === "showcase" && f.shot && f.crop).slice(0, MAX_SHOWCASE);
export const moreFeatures = features.filter((f) => !showcaseFeatures.includes(f));
/** The contact sheet: thumbnails first, then the ones without a screenshot. */
export const framedFeatures = moreFeatures.filter((f) => f.shot && f.crop);
export const indexFeatures = moreFeatures.filter((f) => !(f.shot && f.crop));

if (import.meta.dev) {
  const showcase = features.filter((f) => f.tier === "showcase");
  if (showcase.length > MAX_SHOWCASE) {
    console.warn(`features.ts: the showcase holds at most ${MAX_SHOWCASE} features; demote one to "more".`);
  }
  for (const f of showcase) {
    if (!f.shot || !f.crop) console.warn(`features.ts: showcase feature "${f.id}" needs a shot and a crop.`);
    if (f.title.split(/\s+/).length > 5) console.warn(`features.ts: keep showcase titles to five words ("${f.title}").`);
  }
}
