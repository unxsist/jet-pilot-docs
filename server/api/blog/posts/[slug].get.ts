/* One post with its rendered HTML; drafts too (their page is noindex). */
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, "slug");
  const post = allPosts().find((p) => p.slug === slug);
  if (!post) throw createError({ statusCode: 404, statusMessage: "Post not found" });
  return post;
});
