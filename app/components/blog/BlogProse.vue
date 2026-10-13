<script setup lang="ts">
/* A post body: HTML rendered at build time by modules/blog.ts. */
defineProps<{ html: string }>();
</script>

<template>
  <div class="post-body" v-html="html" />
</template>

<style>
.post-body {
  max-width: 68ch;
  font-size: 1.065rem;
  line-height: 1.75;
  color: color-mix(in srgb, var(--fg) 84%, var(--bg));
}
.post-body > * + * {
  margin-top: 1.35em;
}

/* Headings, with a quiet # in the margin on hover. */
.post-body h2,
.post-body h3 {
  position: relative;
  color: var(--fg);
  font-weight: 600;
  scroll-margin-top: 6rem;
  text-wrap: balance;
}
.post-body h2 {
  margin-top: 2.6em;
  font-size: 1.6rem;
  line-height: 1.2;
  letter-spacing: -0.025em;
}
.post-body h3 {
  margin-top: 2.1em;
  font-size: 1.2rem;
  line-height: 1.35;
  letter-spacing: -0.015em;
}
.post-body h2 + *,
.post-body h3 + * {
  margin-top: 0.8em;
}
.post-body .heading-link {
  color: inherit;
  text-decoration: none;
}
.post-body .heading-link::before {
  content: "#";
  position: absolute;
  right: 100%;
  padding-right: 0.45em;
  color: var(--faint);
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.15s;
}
.post-body .heading-link:hover::before,
.post-body .heading-link:focus-visible::before {
  opacity: 1;
}

.post-body a:not(.heading-link) {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 4px;
  overflow-wrap: anywhere;
  transition: text-decoration-color 0.15s;
}
.post-body a:not(.heading-link):hover {
  text-decoration-color: var(--fg);
}
.post-body strong {
  color: var(--fg);
  font-weight: 600;
}

.post-body ul,
.post-body ol {
  padding-left: 1.4em;
}
.post-body ul {
  list-style: disc;
}
.post-body ol {
  list-style: decimal;
}
.post-body li {
  padding-left: 0.25em;
}
.post-body li + li {
  margin-top: 0.55em;
}
.post-body li::marker {
  color: var(--faint);
}

.post-body blockquote {
  border-left: 2px solid var(--line-strong);
  padding-left: 1.1em;
  color: var(--muted);
}
.post-body hr {
  border: 0;
  border-top: 1px solid var(--line);
  margin-block: 3em;
}

/* Inline code, as elsewhere on the site. */
.post-body :not(pre) > code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.1rem 0.3rem;
  font-size: 0.84em;
  color: var(--fg);
  overflow-wrap: break-word;
}

/* Code blocks: Shiki writes both themes as CSS variables; pick one per mode. */
.post-body pre {
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 0.875rem;
  background: var(--code-bg);
  padding: 1.05rem 1.2rem;
  font-size: 0.8rem;
  line-height: 1.7;
  tab-size: 4;
}
.post-body pre code {
  display: block;
  width: max-content;
  min-width: 100%;
}
.post-body .shiki span {
  color: var(--shiki-light);
}
.dark .post-body .shiki span {
  color: var(--shiki-dark);
}
@media (width < 40rem) {
  /* Let code blocks use the full width of a phone. */
  .post-body pre {
    margin-inline: -1.25rem;
    border-inline: 0;
    border-radius: 0;
    padding-inline: 1.25rem;
  }
}
</style>
