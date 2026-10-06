<script setup lang="ts">
import { RELEASES_URL, formatDate } from "~/composables/useGitHub";

const { platforms, os, release } = useDownloads();
</script>

<template>
  <section id="download" class="relative cv-auto py-24 sm:py-36" aria-labelledby="download-title">
    <div class="container-x">
      <div class="grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
        <h2 id="download-title" class="display text-[2.6rem] sm:text-[4rem] lg:col-span-7 lg:text-[4.75rem]">Take the controls.</h2>
        <p class="max-w-[27rem] text-[1.06rem] leading-relaxed text-muted lg:col-span-5 lg:pb-2">
          Free for everyone, forever.
          <template v-if="release">
            The latest is <span class="font-mono text-[0.95em] text-fg">{{ release.tag }}</span>, released {{ formatDate(release.publishedAt) }}.
            <a :href="release.url" class="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">See what’s new</a>.
          </template>
          <template v-else>Always the latest release.</template>
        </p>
      </div>

      <div class="platforms mt-14 sm:mt-20">
        <article v-for="platform in platforms" :key="platform.os" class="platform" :class="{ 'is-yours': os === platform.os }">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-2xl font-semibold tracking-[-0.03em]">{{ platform.name }}</h3>
            <span v-if="os === platform.os" class="font-mono text-[0.72rem] font-medium text-accent-text">Your system</span>
          </div>
          <p class="mt-1 text-[0.8rem] text-faint">{{ platform.requirement }}</p>

          <ul class="mt-6">
            <li v-for="option in platform.options" :key="option.id">
              <a :href="option.href" class="option group">
                <span class="min-w-0">
                  <span class="block text-[0.93rem] font-medium">{{ option.label }}</span>
                  <span class="block font-mono text-[0.72rem] text-faint">{{ option.detail }}<template v-if="option.size"> · {{ option.size }}</template></span>
                </span>
                <Icon name="download" :size="16" class="ml-auto shrink-0 text-faint transition-colors group-hover:text-fg" />
              </a>
            </li>
          </ul>

          <p v-if="platform.os === 'linux' && !platform.hasArm" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            ARM64 (aarch64) Linux builds arrive with the next release.
          </p>
          <p v-if="platform.os === 'linux'" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            AppImage: run <code class="rounded bg-fg/5 px-1 py-0.5 text-[0.72rem] text-fg/80">chmod +x</code> on the file first.
          </p>
          <p v-if="platform.os === 'windows'" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            SmartScreen may warn about the unsigned installer: choose <span class="text-fg/80">More info → Run anyway</span>.
          </p>
          <p v-if="platform.os === 'macos'" class="mt-4 text-[0.78rem] leading-relaxed text-faint">
            Not sure which Mac you have? Apple menu → About This Mac: “Chip: Apple M…” means Apple Silicon.
          </p>
        </article>
      </div>

      <div class="notes mt-16 sm:mt-20">
        <!-- macOS quarantine note -->
        <article id="macos-note" class="min-w-0">
          <h3 class="font-semibold tracking-tight">Heads-up for macOS</h3>
          <p class="mt-2 text-[0.93rem] leading-relaxed text-muted">
            JET Pilot isn’t notarized by Apple: it’s free and open source, and we’d rather not pay Apple’s yearly fee. So
            on first launch macOS may say the app is <em>“damaged”</em> or refuse to open it. Remove the quarantine flag
            once and you’re good. Auto-updates keep working.
          </p>
          <CopyCommand class="mt-5" command='xattr -dr com.apple.quarantine "/Applications/JET Pilot.app"' label="quarantine fix command" />
          <p class="mt-3 text-[0.78rem] text-faint">Run it in Terminal after moving JET Pilot to Applications. Not needed with Homebrew: the tap does it for you.</p>
        </article>

        <!-- Homebrew -->
        <article class="min-w-0">
          <h3 class="font-semibold tracking-tight">Prefer Homebrew?</h3>
          <p class="mt-2 text-[0.93rem] leading-relaxed text-muted">Install from our tap in one line. It opens right away, no quarantine step.</p>
          <CopyCommand class="mt-5" command="brew install --cask unxsist/tap/jet-pilot" label="Homebrew command" />
          <p class="mt-3 text-[0.78rem] leading-relaxed text-faint">
            Installed it from <code>homebrew/cask</code> before? Run <code>brew uninstall --cask jet-pilot</code> first:
            Homebrew’s main repository only carries notarized apps now. Older versions are on
            <a :href="RELEASES_URL" class="text-fg/80 underline decoration-line-strong underline-offset-4 hover:text-fg">GitHub Releases</a>.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.platforms {
  display: grid;
  gap: 3rem;
}
.platform {
  border-top: 1px solid var(--line-strong);
  padding-top: 1.5rem;
}
.platform.is-yours {
  border-top-color: var(--accent);
}
.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--line);
  padding-block: 0.8rem;
  transition: padding 0.3s var(--ease-out-expo);
}
li:first-child > .option {
  border-top: 1px solid var(--line);
}
.option:hover {
  padding-inline: 0.5rem;
}
.notes {
  display: grid;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .platforms {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5rem;
  }
  .notes {
    grid-template-columns: 3fr 2fr;
    gap: 2.5rem;
  }
}
</style>
