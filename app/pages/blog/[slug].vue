<script setup lang="ts">
import { BLOG_URL, formatPostDate } from "~/utils/blog";

const route = useRoute();
const slug = String(route.params.slug);
const { data: post } = await useFetch(`/api/blog/posts/${slug}`);
if (!post.value) throw createError({ statusCode: 404, statusMessage: "Post not found", fatal: true });

const asset = useAsset();
const url = `${BLOG_URL}${slug}/`;
const title = `${post.value.title} — JET Pilot`;
const description = post.value.description;

useHead({
  link: [
    { rel: "canonical", href: url },
    { rel: "alternate", type: "application/rss+xml", title: "JET Pilot blog", href: asset("blog/rss.xml") },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.value.title,
        description,
        datePublished: post.value.date,
        url,
        mainEntityOfPage: url,
        image: "https://www.jet-pilot.app/images/og-image.png",
        author: { "@type": "Organization", name: "JET Pilot", url: "https://www.jet-pilot.app" },
        publisher: { "@type": "Organization", name: "JET Pilot", url: "https://www.jet-pilot.app" },
      }),
    },
  ],
});

useSeoMeta({
  title,
  description,
  // Drafts can be read at their URL but are kept out of search results (see modules/blog.ts).
  robots: post.value.draft ? "noindex, nofollow" : undefined,
  ogType: "article",
  ogSiteName: "JET Pilot",
  ogTitle: post.value.title,
  ogDescription: description,
  ogImage: "https://www.jet-pilot.app/images/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "JET Pilot — Kubernetes, beautifully. A screenshot of the app showing pods across two clusters.",
  ogUrl: url,
  articlePublishedTime: post.value.date,
  twitterCard: "summary_large_image",
  twitterTitle: post.value.title,
  twitterDescription: description,
  twitterImage: "https://www.jet-pilot.app/images/og-image.png",
});
</script>

<template>
  <main id="main">
    <article v-if="post" class="container-x pb-24 pt-28 sm:pb-32 sm:pt-36" aria-labelledby="post-title">
      <div class="mx-auto max-w-[45rem]">
        <a href="/blog/" class="group inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors hover:text-fg">
          <Icon name="arrowRight" :size="13" class="rotate-180 transition-transform group-hover:-translate-x-0.5" />
          Blog
        </a>

        <header class="mt-10 sm:mt-14">
          <p class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.85rem] text-faint">
            <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ post.readingMinutes }} min read</span>
            <template v-if="post.draft">
              <span aria-hidden="true">·</span>
              <span class="font-medium text-warning">Draft</span>
            </template>
          </p>
          <h1 id="post-title" class="display mt-5 text-[2.4rem] !leading-[1.04] sm:text-[3.4rem]">{{ post.title }}</h1>
          <p class="mt-6 text-pretty text-[1.12rem] leading-relaxed text-muted sm:text-[1.2rem]">{{ post.description }}</p>
          <p v-if="post.draft" class="mt-8 border-l-2 border-warning/60 pl-4 text-[0.85rem] leading-relaxed text-muted">
            This post is a draft. It isn’t listed on the blog or in the feed, and search engines are asked not to index it.
          </p>
        </header>

        <div class="mt-12 border-t border-line pt-10 sm:mt-14 sm:pt-12">
          <BlogProse :html="post.html" />
        </div>
      </div>
    </article>

    <LazySiteFooter hydrate-on-visible />
  </main>
</template>
