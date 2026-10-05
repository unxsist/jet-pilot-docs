/*
 * Links to homepage sections: a bare hash on the homepage (smooth scroll,
 * no reload), "/#section" from any other page.
 */
export function useSiteHref() {
  const route = useRoute();
  const onHome = computed(() => route.path === "/");
  const href = (hash: string) => (onHome.value ? hash : `/${hash}`);
  return { onHome, href };
}
