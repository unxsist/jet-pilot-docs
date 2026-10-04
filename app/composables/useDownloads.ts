import { RELEASES_URL, formatSize, useGitHub, useMountedFlag, type ReleaseAsset } from "./useGitHub";

export type Os = "macos" | "windows" | "linux" | "other";
export type Arch = "arm" | "x86" | null;

export interface DownloadOption {
  id: string;
  label: string;
  detail: string;
  /** Pattern matched against release asset names. */
  match: RegExp;
  /** Fallback size shown before the API answers (from v1.35.0). */
  approx?: string;
  /** Only listed once the release actually contains a matching asset. */
  optional?: boolean;
}

export interface Platform {
  os: Exclude<Os, "other">;
  name: string;
  requirement: string;
  options: DownloadOption[];
}

export const PLATFORMS: Platform[] = [
  {
    os: "macos",
    name: "macOS",
    requirement: "Apple Silicon & Intel",
    options: [
      { id: "mac-arm", label: "Apple Silicon", detail: ".dmg · arm64", match: /_aarch64\.dmg$/, approx: "22 MB" },
      { id: "mac-intel", label: "Intel", detail: ".dmg · x64", match: /_x64\.dmg$/, approx: "23 MB" },
    ],
  },
  {
    os: "windows",
    name: "Windows",
    requirement: "Windows 10 or later · x64",
    options: [
      { id: "win-exe", label: "Installer", detail: ".exe · x64", match: /_x64-setup\.exe$/, approx: "16 MB" },
      { id: "win-msi", label: "MSI package", detail: ".msi · x64", match: /_x64_en-US\.msi$/, approx: "19 MB" },
    ],
  },
  {
    os: "linux",
    name: "Linux",
    requirement: "glibc 2.35+ (Ubuntu 22.04 or newer)",
    options: [
      { id: "linux-deb", label: "Debian / Ubuntu", detail: ".deb · x64", match: /_amd64\.deb$/, approx: "20 MB" },
      { id: "linux-rpm", label: "Fedora / RHEL", detail: ".rpm · x64", match: /\.x86_64\.rpm$/, approx: "20 MB" },
      { id: "linux-appimage", label: "AppImage", detail: ".AppImage · x64", match: /_amd64\.AppImage$/ },
      { id: "linux-deb-arm", label: "Debian / Ubuntu", detail: ".deb · ARM64", match: /_(arm64|aarch64)\.deb$/, optional: true },
      { id: "linux-rpm-arm", label: "Fedora / RHEL", detail: ".rpm · ARM64", match: /\.aarch64\.rpm$/, optional: true },
      { id: "linux-appimage-arm", label: "AppImage", detail: ".AppImage · ARM64", match: /_aarch64\.AppImage$/, optional: true },
    ],
  },
];

export interface ResolvedOption extends DownloadOption {
  href: string;
  size: string | null;
  available: boolean;
}

function resolve(option: DownloadOption, assets: ReleaseAsset[] | null): ResolvedOption {
  const asset = assets?.find((a) => option.match.test(a.name));
  return {
    ...option,
    href: asset?.url ?? RELEASES_URL,
    size: asset ? formatSize(asset.size) : assets ? null : option.approx ?? null,
    available: assets ? Boolean(asset) : !option.optional,
  };
}

export function useDownloads() {
  const { release } = useGitHub();
  const osState = useState<Os>("client-os", () => "other");
  const archState = useState<Arch>("client-arch", () => null);
  const detected = useState<boolean>("client-os-detected", () => false);
  const mounted = useMountedFlag();
  const os = computed<Os>(() => (mounted.value ? osState.value : "other"));
  const arch = computed<Arch>(() => (mounted.value ? archState.value : null));

  if (import.meta.client && !detected.value) {
    detected.value = true;
    onMounted(async () => {
      const os = osState;
      const arch = archState;
      const nav = navigator as Navigator & { userAgentData?: any };
      const ua = nav.userAgent;
      const platform = (nav.userAgentData?.platform || nav.platform || "").toLowerCase();
      const mobile = /iphone|ipad|ipod|android/i.test(ua) || nav.userAgentData?.mobile;
      if (mobile) os.value = "other";
      else if (platform.includes("mac") || /Macintosh/.test(ua)) os.value = "macos";
      else if (platform.includes("win") || /Windows/.test(ua)) os.value = "windows";
      else if (platform.includes("linux") || /Linux|X11/.test(ua)) os.value = "linux";

      try {
        const hints = await nav.userAgentData?.getHighEntropyValues?.(["architecture"]);
        if (hints?.architecture === "arm") arch.value = "arm";
        else if (hints?.architecture === "x86") arch.value = "x86";
      } catch {
        /* not available (Safari, Firefox) */
      }
      if (!arch.value && /aarch64|arm64/i.test(ua)) arch.value = "arm";
    });
  }

  const platforms = computed(() =>
    PLATFORMS.map((p) => ({
      ...p,
      options: p.options
        .map((o) => resolve(o, release.value?.assets ?? null))
        .filter((o) => o.available),
      hasArm: p.os !== "linux" || Boolean(release.value?.assets.some((a) => /aarch64|arm64/.test(a.name) && /\.(deb|rpm|AppImage)$/.test(a.name))),
    }))
  );

  /** The best single download for this visitor, or a link to #download. */
  const primary = computed(() => {
    const version = release.value ? `v${release.value.version}` : null;
    const find = (id: string) =>
      platforms.value.flatMap((p) => p.options).find((o) => o.id === id);

    if (os.value === "macos") {
      const intel = arch.value === "x86";
      const option = find(intel ? "mac-intel" : "mac-arm");
      return {
        label: "Download for macOS",
        sub: intel ? "Intel" : "Apple Silicon",
        href: option?.href ?? "#download",
        version,
        alt: intel
          ? { label: "Apple Silicon Mac?", href: find("mac-arm")?.href ?? "#download" }
          : { label: "Intel Mac?", href: find("mac-intel")?.href ?? "#download" },
        os: os.value,
      };
    }
    if (os.value === "windows") {
      return {
        label: "Download for Windows",
        sub: "x64 installer",
        href: find("win-exe")?.href ?? "#download",
        version,
        alt: null,
        os: os.value,
      };
    }
    if (os.value === "linux") {
      return { label: "Download for Linux", sub: ".deb · .rpm · AppImage", href: "#download", version, alt: null, os: os.value };
    }
    return { label: "Download JET Pilot", sub: "macOS · Windows · Linux", href: "#download", version, alt: null, os: os.value };
  });

  return { os, arch, platforms, primary, release };
}
