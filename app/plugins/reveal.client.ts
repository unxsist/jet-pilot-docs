/*
 * Scroll reveal for [data-reveal] elements. Content is visible by default;
 * the hidden start state only applies once this runs (html.reveal-armed),
 * and never with prefers-reduced-motion.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  nuxtApp.hook("app:mounted", () => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    const viewport = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      // Anything already on screen stays put; only below-the-fold content animates.
      if (el.getBoundingClientRect().top < viewport) el.classList.add("is-visible");
      observer.observe(el);
    });
    document.documentElement.classList.add("reveal-armed");
  });
});
