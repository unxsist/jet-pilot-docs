/* RSS 2.0 feed of published posts, prerendered to /blog/rss.xml. */
const SITE = "https://www.jet-pilot.app";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Root-relative links in a post's HTML point at the live site in feed readers. */
const absolute = (html: string, url: string) =>
  html.replace(/(href|src)="(\/[^"]*|#[^"]*)"/g, (_m, attr, path: string) => `${attr}="${path.startsWith("#") ? url + path : SITE + path}"`);

export default defineEventHandler((event) => {
  const posts = publishedPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE}/blog/${post.slug}/`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
      <content:encoded><![CDATA[${absolute(post.html, url).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>JET Pilot blog</title>
    <link>${SITE}/blog/</link>
    <description>Notes on building JET Pilot, a native Kubernetes desktop client.</description>
    <language>en</language>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />${posts[0] ? `\n    <lastBuildDate>${new Date(`${posts[0].date}T09:00:00Z`).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;
});
