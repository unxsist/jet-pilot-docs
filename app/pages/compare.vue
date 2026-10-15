<script setup lang="ts">
import { CHECKED, COMPARE_FAQS, GROUPS, SOURCES, TOOLS, type Cell } from "~/data/comparison";
import { REPO_URL } from "~/composables/useGitHub";
import { faqJsonLd } from "~/utils/faqs";

const PAGE_URL = "https://www.jet-pilot.app/compare/";
const title = "JET Pilot compared with Lens, Freelens, Headlamp and k9s";
const description =
  "A fair comparison of Kubernetes desktop clients: price, accounts, size, multi-cluster views and cloud accounts, and when another tool is the better choice.";

useHead({
  link: [{ rel: "canonical", href: PAGE_URL }],
  script: [{ type: "application/ld+json", innerHTML: faqJsonLd(COMPARE_FAQS) }],
});
useSeoMeta({
  title,
  description,
  ogType: "website",
  ogSiteName: "JET Pilot",
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://www.jet-pilot.app/images/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "JET Pilot — Kubernetes, beautifully. A screenshot of the app showing pods across two clusters.",
  ogUrl: PAGE_URL,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-image.png",
});

const differences = [
  {
    title: "Every cluster, every cloud, one list.",
    text: "JET Pilot reads all your kubeconfig files and connects your cloud accounts directly: AWS (including IAM Identity Center), Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale. It finds the clusters in them and keeps the list current. Device codes and browser sign-ins happen inside the app. This is free, with no account.",
  },
  {
    title: "Clusters you add work everywhere.",
    text: "Added clusters live in JET Pilot’s own kubeconfig, with credentials in your system keychain, so they also work in kubectl and k9s. Your own kubeconfig is never rewritten.",
  },
  {
    title: "Small and quick.",
    text: "A 26 MB download on macOS and 15 MB on Windows. It streams changes from the Kubernetes API instead of polling, and its tables combine several clusters and namespaces at once.",
  },
  {
    title: "Calm by design.",
    text: "Fewer panels, a command palette for everything, guardrails that ask you to type a name before a destructive action on a protected cluster, and themes you can bring from your editor.",
  },
];

const alternatives = [
  {
    when: "You live in the terminal or work over SSH.",
    text: "k9s is faster to drive from the keyboard than any GUI, runs anywhere a terminal does, and has years of plugins and skins. You can keep both: clusters added in JET Pilot work in k9s too.",
  },
  {
    when: "You want one shared UI for a team, or a browser instead of an app.",
    text: "Headlamp runs inside your cluster with OIDC sign-in and adapts to each user’s RBAC permissions. It is also the Kubernetes project’s recommended replacement for Kubernetes Dashboard.",
  },
  {
    when: "You need plugins.",
    text: "Headlamp has a plugin catalog, Lens an extensions marketplace on paid plans, and Freelens and k9s have extensions and plugins of their own. JET Pilot has no plugin system: its custom actions add your own commands, links and patches to menus, but they can’t add new views.",
  },
  {
    when: "Your company wants a vendor and AI features.",
    text: "Lens is a commercial product with paid plans, an AI assistant and team features.",
  },
  {
    when: "You prefer the Lens workflow you already know.",
    text: "Freelens keeps the classic Lens interface, open source and free.",
  },
  {
    when: "You need signed binaries.",
    text: "JET Pilot is not notarized by Apple or code-signed on Windows. If your company only allows signed apps, that rules it out for now.",
  },
  {
    when: "You use Windows on ARM.",
    text: "JET Pilot doesn’t ship a Windows ARM64 build yet (ARM64 builds are for macOS and Linux); Freelens, Headlamp and k9s do.",
  },
];

const cellLabel = (cell: Cell) =>
  cell.kind === "yes" ? "Yes" : cell.kind === "no" ? "No" : cell.kind === "text" ? cell.text : cell.kind === "na" ? "Doesn’t apply" : "Not confirmed";
</script>

<template>
  <main id="main" class="compare-page">
    <section class="container-x pt-28 sm:pt-36" aria-labelledby="compare-title">
      <h1 id="compare-title" class="display max-w-4xl text-[2.8rem] sm:text-[4.5rem] lg:text-[5.25rem]">
        JET Pilot and other Kubernetes clients.
      </h1>
      <p class="mt-7 max-w-[40rem] text-[1.075rem] leading-relaxed text-muted sm:text-[1.2rem]">
        There are good Kubernetes clients, and most people end up using more than one. This page shows where JET Pilot
        fits, what it does differently, and when another tool is the better choice.
      </p>
      <p class="mt-6 text-[0.85rem] text-faint">
        Last checked: {{ CHECKED }} ·
        Something out of date?
        <a :href="`${REPO_URL}/issues`" class="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-fg">Tell us on GitHub</a>.
      </p>
    </section>

    <!-- At a glance -->
    <section class="container-x mt-16 sm:mt-20" aria-labelledby="glance-title">
      <h2 id="glance-title" class="sr-only">At a glance</h2>
      <p class="mb-3 text-[0.8rem] text-faint md:hidden">Scroll sideways to see every client.</p>
      <div class="compare-scroll -mx-5 overflow-x-auto sm:mx-0" tabindex="0" role="region" aria-label="Comparison table, scrolls sideways">
        <table class="compare-table w-full border-collapse text-left text-[0.875rem]">
          <thead>
            <tr>
              <th scope="col" class="first-col"><span class="sr-only">Feature</span></th>
              <th
                v-for="tool in TOOLS"
                :key="tool.id"
                scope="col"
                class="tool-col pb-4 align-bottom text-[0.95rem] font-semibold tracking-tight"
                :class="tool.id === 'jet' ? 'is-jet text-fg' : 'text-muted'"
              >
                {{ tool.name }}
              </th>
            </tr>
          </thead>
          <tbody v-for="group in GROUPS" :key="group.title">
            <tr>
              <th scope="colgroup" :colspan="TOOLS.length + 1" class="group-row"><span class="sticky left-5 sm:left-0">{{ group.title }}</span></th>
            </tr>
            <tr v-for="row in group.rows" :key="row.label" class="body-row">
              <th scope="row" class="first-col row-label">{{ row.label }}</th>
              <td v-for="tool in TOOLS" :key="tool.id" class="tool-col" :class="{ 'is-jet': tool.id === 'jet' }">
                <span class="mb-1 block text-[0.7rem] font-medium text-faint md:hidden" aria-hidden="true">{{ tool.name }}</span>
                <template v-for="cell in [row.cells[tool.id]]" :key="tool.id">
                  <span v-if="cell.kind === 'yes'" class="inline-flex h-5 items-center text-fg" :title="cellLabel(cell)">
                    <Icon name="check" :size="16" :stroke="2.25" /><span class="sr-only">Yes</span>
                  </span>
                  <span v-else-if="cell.kind === 'no'" class="text-faint">No</span>
                  <span v-else-if="cell.kind === 'text'" :class="tool.id === 'jet' ? 'text-fg' : 'text-muted'">{{ cell.text }}</span>
                  <span v-else-if="cell.kind === 'na'" class="text-faint">n/a<span class="sr-only">: doesn’t apply</span></span>
                  <span v-else class="text-faint" title="Not confirmed">—<span class="sr-only">Not confirmed</span></span>
                  <span v-if="'note' in cell && cell.note" class="mt-1 block text-[0.78rem] leading-snug text-faint">{{ cell.note }}</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8 max-w-3xl space-y-2 text-[0.82rem] leading-relaxed text-faint">
        <p class="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span class="inline-flex items-center gap-1.5"><Icon name="check" :size="14" :stroke="2.25" class="text-fg" /> Yes</span>
          <span><span class="text-fg">—</span> Not confirmed from the project’s own site, docs or releases, so no claim either way</span>
          <span><span class="text-fg">n/a</span> Doesn’t apply</span>
        </p>
        <p>Download sizes are the Apple Silicon <code>.dmg</code> of each tool’s latest release (k9s: the <code>.tar.gz</code>).</p>
      </div>

      <details class="sources group mt-6 max-w-3xl border-t border-line">
        <summary class="flex cursor-pointer list-none items-center gap-2 py-4 text-[0.85rem] text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
          Sources
          <Icon name="chevronDown" :size="14" class="transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <dl class="grid gap-x-8 gap-y-4 pb-6 text-[0.82rem] sm:grid-cols-[8rem_1fr]">
          <template v-for="source in SOURCES" :key="source.tool">
            <dt class="font-medium text-fg">{{ source.tool }}</dt>
            <dd class="-mt-3 text-faint sm:mt-0">
              <template v-for="(link, i) in source.links" :key="link.href">
                <a :href="link.href" class="underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-fg">{{ link.label }}</a><span v-if="i < source.links.length - 1"> · </span>
              </template>
            </dd>
          </template>
        </dl>
      </details>
    </section>

    <!-- What JET Pilot does differently -->
    <section class="relative mt-24 border-t border-line py-24 sm:mt-32 sm:py-32" aria-labelledby="different-title">
      <div class="container-x grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 id="different-title" class="display text-[2.4rem] sm:text-[3.5rem] lg:text-[3.75rem]">What JET Pilot does differently.</h2>
        </div>
        <div class="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          <div v-for="item in differences" :key="item.title">
            <h3 class="text-[1.05rem] font-semibold tracking-tight">{{ item.title }}</h3>
            <p class="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- When to choose something else -->
    <section class="relative border-t border-line py-24 sm:py-32" aria-labelledby="else-title">
      <div class="container-x grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 id="else-title" class="display text-[2.4rem] sm:text-[3.5rem] lg:text-[3.75rem]">When to choose something else.</h2>
        </div>
        <ul class="lg:col-span-8">
          <li v-for="item in alternatives" :key="item.when" class="border-b border-line py-6 first:border-t">
            <h3 class="text-[1.02rem] font-medium tracking-tight">{{ item.when }}</h3>
            <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <LazyFaqSection hydrate-never :items="COMPARE_FAQS" :open="0" />
    <LazySiteFooter hydrate-on-visible />
  </main>
</template>

<style>
.compare-page code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
}

.compare-table th,
.compare-table td {
  vertical-align: top;
}
.compare-table .first-col {
  position: sticky;
  left: 0;
  z-index: 1;
  width: 8.5rem;
  min-width: 8.5rem;
  background: var(--bg);
  padding: 0.95rem 1rem 0.95rem 1.25rem;
}
.compare-table .tool-col {
  min-width: 7.75rem;
  padding: 0.95rem 1rem;
}
.compare-table thead .tool-col {
  vertical-align: bottom;
}
.compare-table .is-jet {
  background: color-mix(in srgb, var(--fg) 3%, var(--bg));
}
.compare-table thead .is-jet {
  border-radius: 0.75rem 0.75rem 0 0;
}
.compare-table .row-label {
  font-weight: 400;
  color: var(--fg);
}
.compare-table .group-row {
  padding: 2.25rem 1.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--faint);
  border-bottom: 1px solid var(--line-strong);
}
.compare-table tbody:first-of-type .group-row {
  padding-top: 1.25rem;
}
.compare-table .body-row > * {
  border-bottom: 1px solid var(--line);
}
/* A hairline at the sticky column's edge while the table scrolls under it. */
.compare-table .first-col::after {
  content: "";
  position: absolute;
  inset: 0 0 0 auto;
  width: 1px;
  background: var(--line);
}
.compare-table thead .first-col::after {
  display: none;
}

@media (width >= 40rem) {
  .compare-table .first-col {
    width: 15rem;
    min-width: 13rem;
    padding-left: 0;
  }
  .compare-table .group-row {
    padding-left: 0;
  }
}
@media (width >= 64rem) {
  .compare-table {
    table-layout: fixed;
  }
  .compare-table .first-col::after {
    display: none;
  }
  .compare-table .tool-col {
    min-width: 0;
  }
}
</style>
