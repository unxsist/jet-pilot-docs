/* The /blog/ index: published posts, without their bodies. */
export default defineEventHandler(() => publishedPosts().map(postMeta));
