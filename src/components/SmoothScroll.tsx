import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

/** Pause or resume smooth scrolling, e.g. while a modal sheet owns the scroll. */
export function setSmoothScrollPaused(paused: boolean) {
  if (paused) lenis?.stop();
  else lenis?.start();
}

/**
 * Smooth, eased wheel and trackpad scrolling (Lenis). It still drives the page's native scroll,
 * so sticky sections and every scroll-linked animation keep working; touch scrolling stays native
 * on phones, and visitors who ask for reduced motion keep the browser's own scrolling.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ autoRaf: true, lerp: .1, wheelMultiplier: 1, allowNestedScroll: true });
    lenis = instance;

    // In-page links glide to their section (Lenis applies each section's scroll-margin-top itself).
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target || event.defaultPrevented) return;
      event.preventDefault();
      instance.scrollTo(target, { duration: 1.2 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
}
