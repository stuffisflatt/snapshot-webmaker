import { useRef } from "react";

/**
 * Touch handlers that report a horizontal swipe: 1 for "next" (finger moves left), -1 for "back".
 * A mostly vertical drag is left alone so the page still scrolls.
 */
export function useSwipe(onSwipe: (step: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => { const t = e.touches[0]!; start.current = { x: t.clientX, y: t.clientY }; },
    onTouchEnd: (e: React.TouchEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const t = e.changedTouches[0]!, dx = t.clientX - from.x, dy = t.clientY - from.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) onSwipe(dx < 0 ? 1 : -1);
    },
  };
}
