import posts from "#blog-posts";

/** Every post, drafts included, newest first. */
export const allPosts = () => posts;

/** What /blog/ and the feed list: published posts only. */
export const publishedPosts = () => posts.filter((p) => !p.draft);

export const postMeta = ({ html: _html, ...meta }: (typeof posts)[number]) => meta;
