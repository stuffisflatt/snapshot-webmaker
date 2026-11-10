import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Instagram, MapPin, MessageCircle, MessagesSquare, Phone, X } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { setSmoothScrollPaused } from "@/components/SmoothScroll";

/** Any "Contact us" button opens the sheet through this event, so it works from every section. */
export const CONTACT_EVENT = "alphastom:contact";
export const openContact = () => window.dispatchEvent(new Event(CONTACT_EVENT));

const EXIT_MS = 260;
const DIGITS = CLINIC.mobileHref.replace("tel:+", "");

// WhatsApp and Viber assume the mobile number is registered on both: confirm with the clinic.
const ROWS: { icon: ReactNode; label: string; value: string; href: string; external?: boolean }[] = [
  { icon: <Phone />, label: "Զանգահարել", value: CLINIC.mobile, href: CLINIC.mobileHref },
  { icon: <MessageCircle />, label: "WhatsApp", value: "Գրել հաղորդագրություն", href: `https://wa.me/${DIGITS}`, external: true },
  { icon: <MessagesSquare />, label: "Viber", value: "Գրել հաղորդագրություն", href: `viber://chat?number=%2B${DIGITS}` },
  { icon: <Phone />, label: "Քաղաքային", value: CLINIC.landline, href: CLINIC.landlineHref },
  { icon: <Instagram />, label: "Instagram", value: "@alphastom_mc", href: CLINIC.instagram, external: true },
  { icon: <MapPin />, label: "Հասցե", value: CLINIC.address, href: CLINIC.yandex, external: true },
];

/** Contact as the same frosted sheet as booking: every way to reach the clinic, one tap each. */
export function ContactSheet() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const show = () => { setClosing(false); setOpen(true); };
    window.addEventListener(CONTACT_EVENT, show);
    return () => window.removeEventListener(CONTACT_EVENT, show);
  }, []);

  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOpen(false); return; }
    setClosing(true);
    window.setTimeout(() => { setOpen(false); setClosing(false); }, EXIT_MS);
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

  if (!open) return null;
  return (
    <div className="bk" data-state={closing ? "closing" : "open"} role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <button className="bk-scrim" aria-label="Փակել" tabIndex={-1} onClick={close} />
      <div ref={ref} className="bk-sheet" data-lenis-prevent>
        <span className="bk-grabber" aria-hidden="true" />
        <header className="bk-head">
          <div>
            <p className="bk-caption">(Կապ)</p>
            <h2 id="contact-title" className="bk-title">Կապ <span className="bk-serif">մեզ հետ</span></h2>
          </div>
          <button type="button" className="bk-close" aria-label="Փակել" onClick={close}><X /></button>
        </header>
        <p className="ct-lede">Գրեք կամ զանգահարեք․ կպատասխանենք աշխատանքային ժամերին։</p>
        <ul className="ct-list">
          {ROWS.map(row => (
            <li key={row.label}>
              <a className="ct-row" href={row.href} {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="ct-icon" aria-hidden="true">{row.icon}</span>
                <span className="ct-text"><small>{row.label}</small><span>{row.value}</span></span>
                <ArrowUpRight className="ct-arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
