/* Shared by the blog pages. Dates are calendar dates, so format them in UTC. */
export const BLOG_URL = "https://www.jet-pilot.app/blog/";

export const formatPostDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
