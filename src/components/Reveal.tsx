import { createElement, useEffect, type CSSProperties } from "react";

/**
 * Marks every [data-reveal] block with data-in once a fifth of it is on screen (with a slight
 * lower-viewport bias), then stops watching it: the reveal plays once, never on every pass.
 */
export function useScrollReveal() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      blocks.forEach(b => (b.dataset["in"] = "true"));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).dataset["in"] = "true";
      io.unobserve(entry.target);
    }), { threshold: .2, rootMargin: "0px 0px -10% 0px" });
    blocks.forEach(b => io.observe(b));
    return () => io.disconnect();
  }, []);
}

/** A heading whose words fade and rise into place one after another (staggered word reveal). */
export function WordReveal({ text, as = "h2", className = "", delay = 0 }: { text: string; as?: "h2" | "h3" | "p"; className?: string; delay?: number }) {
  const words = text.split(" ");
  return createElement(as, { className: `word-reveal ${className}`, "aria-label": text },
    words.map((word, i) => (
      <span key={i} aria-hidden="true">
        <span className="word-reveal-word" style={{ "--word-index": i + delay } as CSSProperties}>{word}</span>
        {i < words.length - 1 && " "}
      </span>
    )));
}

/** Stagger index for a .rise element. */
export const riseStyle = (i: number) => ({ "--i": i }) as CSSProperties;
