/* Rendered posts, provided at build time by modules/blog.ts. */
declare module "#blog-posts" {
  const posts: import("../modules/blog").BlogPost[];
  export default posts;
}
