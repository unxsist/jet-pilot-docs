<script setup lang="ts">
import { RELEASES_URL, formatDate } from "~/composables/useGitHub";

const { platforms, os, release } = useDownloads();
const osIcon: Record<string, string> = { macos: "apple", windows: "windows", linux: "terminal" };
</script>

<template>
  <section id="download" class="relative cv-auto isolate overflow-hidden py-20 sm:py-28" aria-labelledby="download-title">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40"
        style="background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 30%, transparent), transparent)"
      />
    </div>
    <div class="container-x">
      <div data-reveal class="mx-auto max-w-2xl text-center">
        <span class="eyebrow">Download</span>
        <h2 id="download-title" class="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl sm:leading-[1.02]">
          <span class="text-shine">Take the controls.</span>
        </h2>
        <p class="mt-4 text-[1.05rem] leading-relaxed text-muted">
          Free for everyone, forever. Pick your platform —
          <template v-if="release">
            <span class="font-mono text-fg">{{ release.tag }}</span>, released {{ formatDate(release.publishedAt) }}.
            <a :href="release.url" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">See what’s new</a>.
          </template>
          <template v-else>always the latest release.</template>
        </p>
      </div>

      <div class="mt-14 grid gap-4 lg:grid-cols-3">
        <article
          v-for="(platform, i) in platforms"
          :key="platform.os"
          data-reveal
          :style="{ '--reveal-delay': `${i * 80}ms` }"
          class="card flex flex-col p-6 transition-shadow sm:p-7"
          :class="os === platform.os ? 'ring-1 ring-accent/50' : ''"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface-2">
                <Icon :name="osIcon[platform.os]" :size="19" />
              </span>
              <div>
                <h3 class="text-lg font-semibold tracking-tight">{{ platform.name }}</h3>
                <p class="text-[0.78rem] text-faint">{{ platform.requirement }}</p>
              </div>
            </div>
            <span v-if="os === platform.os" class="rounded-full bg-accent-soft px-2 py-0.5 text-[0.68rem] font-semibold text-accent-text">Your system</span>
          </div>

          <ul class="mt-6 grid gap-2">
            <li v-for="option in platform.options" :key="option.id">
              <a
                :href="option.href"
                class="group flex items-center gap-3 rounded-xl border border-line bg-bg/50 px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <span class="min-w-0">
                  <span class="block text-[0.9rem] font-medium">{{ option.label }}</span>
                  <span class="block font-mono text-[0.72rem] text-faint">{{ option.detail }}<template v-if="option.size"> · {{ option.size }}</template></span>
                </span>
                <Icon name="download" :size="16" class="ml-auto shrink-0 text-faint transition-colors group-hover:text-accent-text" />
              </a>
            </li>
          </ul>

          <p v-if="platform.os === 'linux' && !platform.hasArm" class="mt-4 flex gap-2 text-[0.78rem] leading-relaxed text-faint">
            <Icon name="info" :size="14" class="mt-0.5 shrink-0" />
            ARM64 (aarch64) Linux builds arrive with the next release.
          </p>
          <p v-if="platform.os === 'linux'" class="mt-3 text-[0.78rem] leading-relaxed text-faint">
            AppImage: run <code class="rounded bg-fg/5 px-1 py-0.5 text-[0.72rem] text-fg/80">chmod +x</code> on the file first.
          </p>
          <p v-if="platform.os === 'windows'" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            SmartScreen may warn about the unsigned installer — choose <span class="text-fg/80">More info → Run anyway</span>.
          </p>
          <p v-if="platform.os === 'macos'" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            Not sure which Mac you have? Apple menu → About This Mac: “Chip: Apple M…” means Apple Silicon.
          </p>
        </article>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-5">
        <!-- macOS quarantine note -->
        <article id="macos-note" data-reveal class="card min-w-0 overflow-hidden p-6 sm:p-7 lg:col-span-3">
          <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-warning/60 to-transparent" />
          <div class="flex items-center gap-2.5">
            <span class="inline-flex size-8 items-center justify-center rounded-lg bg-warning/12 text-warning"><Icon name="apple" :size="16" /></span>
            <h3 class="font-semibold tracking-tight">Heads-up for macOS</h3>
          </div>
          <p class="mt-3 text-[0.93rem] leading-relaxed text-muted">
            JET Pilot isn’t notarized by Apple — it’s free and open source, and we’d rather not pay Apple’s yearly fee.
            So on first launch macOS may say the app is <em>“damaged”</em> or refuse to open it. Remove the quarantine
            flag once and you’re good. Auto-updates keep working.
          </p>
          <CopyCommand class="mt-5" command='xattr -dr com.apple.quarantine "/Applications/JET Pilot.app"' label="quarantine fix command" />
          <p class="mt-3 text-[0.78rem] text-faint">Run it in Terminal after moving JET Pilot to Applications. Not needed with Homebrew: the tap does it for you.</p>
        </article>

        <!-- Homebrew -->
        <article data-reveal style="--reveal-delay: 80ms" class="card min-w-0 p-6 sm:p-7 lg:col-span-2">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent-text"><Icon name="package" :size="16" /></span>
            <h3 class="font-semibold tracking-tight">Prefer Homebrew?</h3>
          </div>
          <p class="mt-3 text-[0.93rem] leading-relaxed text-muted">Install from our tap in one line — it opens right away, no quarantine step.</p>
          <CopyCommand class="mt-5" command="brew install --cask unxsist/tap/jet-pilot" label="Homebrew command" />
          <p class="mt-3 text-[0.78rem] leading-relaxed text-faint">
            Installed it from <code>homebrew/cask</code> before? Run <code>brew uninstall --cask jet-pilot</code> first —
            Homebrew’s main repository only carries notarized apps now.
          </p>
          <p class="mt-5 text-[0.78rem] leading-relaxed text-faint">
            Looking for older versions? Every release is on
            <a :href="RELEASES_URL" class="text-fg/80 underline decoration-line-strong underline-offset-4 hover:text-fg">GitHub Releases</a>.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
