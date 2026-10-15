<script setup lang="ts">
import { BLOG_URL, formatPostDate } from "~/utils/blog";

const { data: posts } = await useFetch("/api/blog/posts", { default: () => [] });

const asset = useAsset();
const title = "Blog — JET Pilot";
const description = "Notes on building JET Pilot, a free, open-source and native Kubernetes desktop client made with Rust and Tauri.";

useHead({
  link: [
    { rel: "canonical", href: BLOG_URL },
    { rel: "alternate", type: "application/rss+xml", title: "JET Pilot blog", href: asset("blog/rss.xml") },
  ],
});

useSeoMeta({
  title,
  description,
  // With nothing published yet, the index stays out of search results (see modules/blog.ts).
  robots: posts.value.length ? undefined : "noindex, nofollow",
  ogType: "website",
  ogSiteName: "JET Pilot",
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://www.jet-pilot.app/images/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "JET Pilot — Kubernetes, beautifully. A screenshot of the app showing pods across two clusters.",
  ogUrl: BLOG_URL,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-image.png",
});
</script>

<template>
  <main id="main">
    <section class="container-x pb-24 pt-28 sm:pb-32 sm:pt-36" aria-labelledby="blog-title">
      <div class="mx-auto max-w-[45rem]">
        <h1 id="blog-title" class="display text-[3.4rem] sm:text-[5rem]">Blog</h1>
        <p class="mt-6 max-w-[34rem] text-[1.075rem] leading-relaxed text-muted sm:text-[1.15rem]">
          Notes on building JET Pilot: how it works inside, what we learned and what’s next.
        </p>

        <ol v-if="posts.length" class="mt-16 border-t border-line">
          <li v-for="post in posts" :key="post.slug" class="border-b border-line">
            <a :href="`/blog/${post.slug}/`" class="group block py-8">
              <p class="text-[0.82rem] text-faint">
                <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
                <span aria-hidden="true"> · </span>{{ post.readingMinutes }} min read
              </p>
              <h2 class="mt-2.5 text-balance text-[1.45rem] font-semibold leading-snug tracking-[-0.025em] transition-colors group-hover:text-muted sm:text-[1.7rem]">
                {{ post.title }}
              </h2>
              <p class="mt-2.5 leading-relaxed text-muted">{{ post.description }}</p>
            </a>
          </li>
        </ol>
        <p v-else class="mt-16 border-t border-line pt-8 text-muted">Nothing published yet. The first post is on its way.</p>

        <p class="mt-10 text-[0.85rem] text-faint">
          Follow along with the
          <a :href="asset('blog/rss.xml')" class="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-fg">RSS feed</a>.
        </p>
      </div>
    </section>

    <LazySiteFooter hydrate-on-visible />
  </main>
</template>
