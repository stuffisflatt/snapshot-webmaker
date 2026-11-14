import { useCallback, useEffect, useRef, useState } from "react";
import { setSmoothScrollPaused } from "@/components/SmoothScroll";

/** How long a sheet takes to leave; it must match the CSS exit animation. */
const EXIT_MS = 260;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The shared life cycle of the frosted sheets (booking, contact, menu): while open it locks page
 * scroll, pauses smooth scrolling, keeps Tab focus inside the sheet, closes on Escape and gives
 * focus back on close. close() plays the exit animation, then calls onClosed; reopening during the
 * exit cancels it. close(then) runs `then` only after the page is scrollable again.
 */
export function useSheet(open: boolean, onClosed: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef(0);
  const closedRef = useRef(onClosed);
  closedRef.current = onClosed;

  const reopen = useCallback(() => { window.clearTimeout(timer.current); setClosing(false); }, []);

  const close = useCallback((then?: () => void) => {
    window.clearTimeout(timer.current);
    const finish = () => {
      setClosing(false);
      closedRef.current();
      // Two frames: React commits the close and the open effect's cleanup unlocks the page first.
      if (then) requestAnimationFrame(() => requestAnimationFrame(then));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    setClosing(true);
    timer.current = window.setTimeout(finish, EXIT_MS);
  }, []);

  useEffect(() => {
    if (!open) return;
    reopen();
    const prev = document.activeElement as HTMLElement | null;
    // Locking scroll hides the scrollbar; padding of the same width keeps the page exactly as wide,
    // so nothing behind the sheet re-lays out (on PC it shifted 15px and every background jumped).
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.style.overflow = "hidden";
    setSmoothScrollPaused(true);
    const focus = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(".bk-close")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0]!, last = items[items.length - 1]!;
      const inside = ref.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      setSmoothScrollPaused(false);
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, close, reopen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { ref, closing, close, reopen };
}
