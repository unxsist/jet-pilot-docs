/*
 * Live GitHub data, fetched client-side (the site is static). Everything has
 * a graceful fallback: if the API is unreachable or rate limited the page
 * still renders with links to the releases page and no invented numbers.
 */

export const REPO = "unxsist/jet-pilot";
export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

/** First version with Clusters 2.0: the Clusters hub, every cloud, in-app sign-in and guardrails. */
export const CLUSTERS_RELEASE_VERSION = "2.0.0";

export interface ReleaseAsset {
  name: string;
  size: number;
  url: string;
}

export interface Release {
  tag: string;
  version: string;
  publishedAt: string;
  url: string;
  assets: ReleaseAsset[];
}

export interface Contributor {
  login: string;
  avatar: string;
  url: string;
  contributions: number;
}

const CACHE_TTL = 10 * 60 * 1000;

async function cachedJson<T>(key: string, url: string): Promise<T | null> {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const { at, data } = JSON.parse(raw);
      if (Date.now() - at < CACHE_TTL) return data as T;
    }
  } catch {
    /* storage unavailable */
  }
  try {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as T;
    try {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch {
      /* ignore */
    }
    return data;
  } catch {
    return null;
  }
}

let started = false;

/**
 * True once the calling component is mounted. Client-only data is gated on
 * it so a component always hydrates with the same markup the server rendered
 * (sections hydrate lazily, after this data may already have arrived).
 */
export function useMountedFlag() {
  const mounted = ref(false);
  if (getCurrentInstance()) onMounted(() => (mounted.value = true));
  return mounted;
}

export function useGitHub() {
  const releaseState = useState<Release | null>("gh-release", () => null);
  const starsState = useState<number | null>("gh-stars", () => null);
  const contributorsState = useState<Contributor[] | null>("gh-contributors", () => null);
  const loaded = useState<boolean>("gh-loaded", () => false);
  const mounted = useMountedFlag();
  const release = computed(() => (mounted.value ? releaseState.value : null));
  const stars = computed(() => (mounted.value ? starsState.value : null));
  const contributors = computed(() => (mounted.value ? contributorsState.value : null));

  if (import.meta.client && !started) {
    started = true;
    onNuxtReady(async () => {
      const [rel, repo, people] = await Promise.all([
        cachedJson<any>("jp-release", `https://api.github.com/repos/${REPO}/releases/latest`),
        cachedJson<any>("jp-repo", `https://api.github.com/repos/${REPO}`),
        cachedJson<any[]>("jp-contributors", `https://api.github.com/repos/${REPO}/contributors?per_page=40`),
      ]);
      if (rel?.tag_name) {
        releaseState.value = {
          tag: rel.tag_name,
          version: String(rel.tag_name).replace(/^v/, ""),
          publishedAt: rel.published_at,
          url: rel.html_url,
          assets: (rel.assets || []).map((a: any) => ({
            name: a.name,
            size: a.size,
            url: a.browser_download_url,
          })),
        };
      }
      if (typeof repo?.stargazers_count === "number") starsState.value = repo.stargazers_count;
      if (Array.isArray(people)) {
        contributorsState.value = people
          .filter((c) => c.type !== "Bot" && !/\[bot\]|-bot$/i.test(c.login))
          .map((c) => ({
            login: c.login,
            avatar: c.avatar_url,
            url: c.html_url,
            contributions: c.contributions,
          }));
      }
      loaded.value = true;
    });
  }

  return { release, stars, contributors, loaded };
}

export function compareVersions(a: string, b: string) {
  const pa = a.split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  const pb = b.split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

/**
 * Whether the latest release is at least `version`.
 * `null` while we don't know yet (static HTML, API down).
 */
export function useReleaseAtLeast(version: string) {
  const { release } = useGitHub();
  return computed<boolean | null>(() =>
    release.value ? compareVersions(release.value.version, version) >= 0 : null
  );
}

export function formatSize(bytes: number) {
  return `${Math.round(bytes / 1_048_576)} MB`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
