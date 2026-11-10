import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { openContact } from "@/components/ContactSheet";
import { setSmoothScrollPaused } from "@/components/SmoothScroll";

const SECTIONS = [
  { id: "how", label: "Ինչպես ենք աշխատում" },
  { id: "doctors", label: "Մասնագետներ" },
  { id: "services", label: "Ծառայություններ" },
  { id: "results", label: "Արդյունքներ" },
  { id: "reviews", label: "Կարծիքներ" },
  { id: "faq", label: "Հարցեր" },
];
const EXIT_MS = 260;

/**
 * Phones only: two round frosted icons sitting in the hero (menu and contact). They belong to the
 * first screen and scroll away with it; the menu opens the same frosted sheet as booking.
 */
export function MobileNav() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = useCallback((then?: () => void) => {
    const done = () => { setOpen(false); setClosing(false); then?.(); };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { done(); return; }
    setClosing(true);
    window.setTimeout(done, EXIT_MS);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    setSmoothScrollPaused(true);
    const focus = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(".bk-close")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      document.body.style.overflow = "";
      setSmoothScrollPaused(false);
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, close]);

  const go = (id: string) => close(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));

  return (
    <>
      <div className="m-nav">
        <button type="button" className="m-nav-btn" aria-label="Մենյու" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
        <button type="button" className="m-nav-btn" aria-label="Կապ մեզ հետ" onClick={openContact}><Phone /></button>
      </div>
      {open && createPortal(
        <div className="bk" data-state={closing ? "closing" : "open"} role="dialog" aria-modal="true" aria-labelledby="menu-title">
          <button className="bk-scrim" aria-label="Փակել" tabIndex={-1} onClick={() => close()} />
          <div ref={ref} className="bk-sheet" data-lenis-prevent>
            <span className="bk-grabber" aria-hidden="true" />
            <header className="bk-head">
              <div>
                <p className="bk-caption">(Մենյու)</p>
                <h2 id="menu-title" className="bk-title">Ալֆա<span className="bk-serif">ստոմ</span></h2>
              </div>
              <button type="button" className="bk-close" aria-label="Փակել" onClick={() => close()}><X /></button>
            </header>
            <nav aria-label="Բաժիններ">
              <ul className="m-menu">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={e => { e.preventDefault(); go(s.id); }}>
                      <span className="m-menu-num">{String(i + 1).padStart(2, "0")}</span>{s.label}<ArrowUpRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      , document.body)}
    </>
  );
}
