/*
 * A file from public/ under the site's base URL (/ on the live site,
 * /preview/ on a preview build), for paths written in code rather than
 * resolved by the bundler.
 */
export function useAsset() {
  const base = useRuntimeConfig().app.baseURL;
  return (path: string) => `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
