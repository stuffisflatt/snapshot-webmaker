import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { openContact } from "@/components/ContactSheet";
import { useSheet } from "@/components/useSheet";

const SECTIONS = [
  { id: "how", label: "Ինչպես ենք աշխատում" },
  { id: "doctors", label: "Մասնագետներ" },
  { id: "services", label: "Ծառայություններ" },
  { id: "results", label: "Արդյունքներ" },
  { id: "reviews", label: "Կարծիքներ" },
  { id: "faq", label: "Հարցեր" },
];

/**
 * Phones only: two round frosted icons sitting in the hero (menu and contact). They belong to the
 * first screen and scroll away with it; the menu opens the same frosted sheet as booking.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { ref, closing, close, reopen } = useSheet(open, () => setOpen(false));
  const show = () => { setOpen(true); reopen(); };

  // The jump runs once the sheet has closed and the page can scroll again.
  const go = (id: string) => close(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));

  return (
    <>
      <div className="m-nav">
        <button type="button" className="m-nav-btn" aria-label="Մենյու" aria-expanded={open} onClick={show}><Menu /></button>
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
