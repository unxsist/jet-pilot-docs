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
 * has the same minor version (2.2) as the newest feature on this list.
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
    id: "gitops",
    title: "GitOps, at a glance.",
    lead: "Every Flux and Argo CD delivery across your clusters on one page, problems first.",
    points: ["Why it fails, in plain words", "What it delivered, out of sync first", "Reconcile, sync, suspend or refresh"],
    shot: "gitops",
    crop: { zoom: 1.5, focus: [0.37, 0.42], mobile: { zoom: 3.2, focus: [0.36, 0.43] } },
    alt: "The GitOps page: Flux and Argo CD deliveries under Needs attention and In progress, each with its state in words, and the panel of the payments Kustomization, unhealthy because Deployment payments-worker isn't ready, with Reconcile and Suspend buttons and the resources it delivered",
    tier: "showcase",
    since: "2.2.0",
  },
  {
    id: "usage",
    title: "Usage, over time.",
    lead: "CPU and memory over an hour to a week, right in the side panel, with requests and limits drawn in.",
    points: ["Finds Prometheus, Thanos or VictoriaMetrics by itself", "Through the API server: nothing to port-forward", "metrics-server’s last 15 minutes as a fallback"],
    shot: "usage",
    crop: { zoom: 1.85, focus: [0.81, 0.36], mobile: { zoom: 3.2, focus: [0.82, 0.38] } },
    alt: "The side panel of the payments-api Deployment: CPU and memory charts over 6 hours with request lines, and a readout at 02:31 of 887m CPU, 74% of the request",
    tier: "showcase",
    since: "2.2.0",
  },
  {
    id: "access",
    title: "Who can do what.",
    lead: "Ask “Can I delete deployments in payments?” and get a yes or no, with the binding and role behind it.",
    points: ["Who can: every user, group and service account", "What a subject can do, and how", "Roles and bindings in sentences"],
    shot: "access-review",
    crop: { zoom: 1.45, focus: [0.42, 0.33], mobile: { zoom: 3, focus: [0.4, 0.33] } },
    alt: "Access review: Can I delete deployments in payments? Yes, granted to the group acme:payments-team by RoleBinding payments-team-admin and ClusterRole admin, above a matrix of what you can do in payments",
    tier: "showcase",
    since: "2.2.0",
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
    id: "graph",
    title: "What’s broken, first.",
    lead: "Every app gets its own lane, from Ingress to Service to Pods, and health rolls up from pods to apps.",
    points: ["Missing references as red dashed nodes", "<kbd>P</kbd> shows only the problems"],
    shot: "graph",
    crop: { zoom: 1.45, focus: [0.385, 0.56], mobile: { zoom: 3, focus: [0.38, 0.57] } },
    side: "right",
    alt: "The resource graph with the checkout-api Deployment selected: its Service, PodDisruptionBudget and ConfigMap highlighted along the path, and a side panel listing its pods, relationships and replica status",
    tier: "showcase",
    since: "1.37.0",
  },

  /* ---------------------------------------------------------------- more -- */
  {
    id: "helm",
    title: "Helm, built in",
    lead: "Releases read straight from the cluster, a history that says what changed, chart search and a guided install.",
    shot: "helm",
    crop: { zoom: 3.3, focus: [0.85, 0.6] },
    alt: "The release panel of payments-api: deployed revision 42 of chart 2.14.3, and a history whose latest entry says 2.14.2 → 2.14.3 · image.tag changed",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "operators",
    title: "Operators, first-class",
    lead: "cert-manager, Gateway API, Karpenter, KEDA, External Secrets and Prometheus Operator, in plain words.",
    shot: "operators",
    crop: { zoom: 4, focus: [0.875, 0.43] },
    alt: "A certificate whose ACME challenge fails: Issuance failed, the chain from request to order to challenge, and “The CA got a 404 from the challenge URL”",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "details",
    title: "Panels that explain",
    lead: "Every side panel opens with the object’s state in a sentence, and links to what it’s connected to.",
    shot: "side-panel",
    crop: { zoom: 3.6, focus: [0.87, 0.225] },
    alt: "The side panel of a crash-looping pod: “Restarting: the container keeps crashing: it exits with code 1”, with its node, owner chain and service account",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "inline-edit",
    title: "Edit labels in place",
    lead: "Labels, annotations and node taints, with a preview of every change before you save.",
    shot: "inline-edit",
    crop: { zoom: 3, focus: [0.825, 0.68] },
    alt: "Editing the labels of the payments-api Deployment in its side panel, with a preview of three changes and a Save 3 changes button",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "port-forwards",
    title: "Port forwards that heal",
    lead: "Forwards follow their pod through restarts and rollouts, and an HTTP tester sends them requests.",
    shot: "port-forwards",
    crop: { zoom: 2.8, focus: [0.34, 0.82] },
    alt: "The port forwards list: payments-api on localhost:8080, checkout-web reconnected 4 minutes ago because its pod was replaced, and postgres on localhost:5432",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "custom-actions",
    title: "Your own actions",
    lead: "Small YAML files become one-click actions in row menus, the side panel and the command palette.",
    shot: "custom-actions",
    crop: { zoom: 2.6, focus: [0.585, 0.34] },
    alt: "Settings › Actions: actions such as Logs since…, Open in Grafana and Restart deployment with on/off switches, one broken file with its line number and a Fix in YAML button",
    tier: "more",
    since: "2.2.0",
  },
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
    id: "logs",
    title: "Every pod, one stream",
    lead: "Follow all pods of a Deployment, StatefulSet, DaemonSet, Job or Service at once, with JSON parsed into fields.",
    shot: "logs",
    crop: { zoom: 3, focus: [0.42, 0.6] },
    alt: "Logs for the payments-api Deployment: four pods listed with their own colours, container and field filters, and interleaved log lines prefixed with the pod and container they came from",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "live",
    title: "Live, not polled",
    lead: "Tables stream changes from the API server, with CPU and memory sparklines for every pod.",
    shot: "live",
    crop: { zoom: 3.4, focus: [0.74, 0.3] },
    alt: "The pods table with CPU and memory sparkline columns next to each pod's status",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "sign-in",
    title: "Sign in, in the app",
    lead: "Device codes and browser sign-ins for kubelogin, gcloud, az, AWS and OIDC plugins appear right in JET Pilot.",
    shot: "sign-in",
    crop: { zoom: 2.6, focus: [0.5, 0.48] },
    alt: "Signing in to AWS inside JET Pilot: the device code QXRW-PLMK, the verification address device.sso.eu-west-1.amazonaws.com and an Open browser button",
    tier: "more",
    since: "2.0.0",
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
    id: "native",
    title: "Straight to the API",
    lead: "Describe, YAML, browsing Helm releases and port forwards work without kubectl or helm.",
    tier: "more",
    since: "2.2.0",
  },
  {
    id: "crds",
    title: "Columns for every CRD",
    lead: "Any custom resource shows its CRD’s own columns, live, and well-known projects get their own section.",
    tier: "more",
    since: "2.2.0",
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
    id: "debug",
    title: "Shells and debugging",
    lead: "Shells into any container, ephemeral debug containers, node shells and file copies.",
    tier: "more",
    since: "1.37.0",
  },
  {
    id: "hardened",
    title: "Hardened by default",
    lead: "A strict content security policy, minimal permissions, and Secrets that stay in memory.",
    tier: "more",
    since: "1.36.0",
  },
];

/* "2.2.0" -> [2, 2]: a release is a minor version, patches don't bring features. */
const release = (version: string) => version.split(".").slice(0, 2).map((n) => Number.parseInt(n, 10) || 0);
const newest = features.map((f) => release(f.since)).reduce((a, b) => (b[0] > a[0] || (b[0] === a[0] && b[1] > a[1]) ? b : a));

/** The newest release on the list ("2.2"): its features carry a "New" badge. */
export const currentRelease = newest.join(".");

export const isNew = (feature: Feature) => release(feature.since).join(".") === currentRelease;

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
