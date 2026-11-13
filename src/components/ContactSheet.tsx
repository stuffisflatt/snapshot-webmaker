import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Facebook, Instagram, MessageCircle, MessagesSquare, Phone, X } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { useSheet } from "@/components/useSheet";

/** Any "Contact us" button opens the sheet through this event, so it works from every section. */
export const CONTACT_EVENT = "alphastom:contact";
export const openContact = () => window.dispatchEvent(new Event(CONTACT_EVENT));

const DIGITS = CLINIC.mobileHref.replace("tel:+", "");

// Two rows of three: calls and Instagram, then the messengers and Facebook.
// WhatsApp and Viber assume the mobile number is registered on both: confirm with the clinic.
const ROWS: { icon: ReactNode; label: string; value: string; href: string; external?: boolean }[] = [
  { icon: <Phone />, label: "Բջջային", value: CLINIC.mobile, href: CLINIC.mobileHref },
  { icon: <Phone />, label: "Քաղաքային", value: CLINIC.landline, href: CLINIC.landlineHref },
  { icon: <Instagram />, label: "Instagram", value: "@alphastom_mc", href: CLINIC.instagram, external: true },
  { icon: <MessagesSquare />, label: "Viber", value: "Հաղորդագրություն", href: `viber://chat?number=%2B${DIGITS}` },
  { icon: <MessageCircle />, label: "WhatsApp", value: "Հաղորդագրություն", href: `https://wa.me/${DIGITS}`, external: true },
  { icon: <Facebook />, label: "Facebook", value: "Alphastom", href: CLINIC.facebook, external: true },
];

/** Contact as the same frosted sheet as booking: every way to reach the clinic, one tap each. */
export function ContactSheet() {
  const [open, setOpen] = useState(false);
  const { ref, closing, close, reopen } = useSheet(open, () => setOpen(false));

  // Opening while the sheet is still leaving cancels the exit instead of being undone by it.
  useEffect(() => {
    const show = () => { setOpen(true); reopen(); };
    window.addEventListener(CONTACT_EVENT, show);
    return () => window.removeEventListener(CONTACT_EVENT, show);
  }, [reopen]);

  if (!open) return null;
  return (
    <div className="bk" data-state={closing ? "closing" : "open"} role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <button className="bk-scrim" aria-label="Փակել" tabIndex={-1} onClick={() => close()} />
      <div ref={ref} className="bk-sheet ct-sheet" data-lenis-prevent>
        <span className="bk-grabber" aria-hidden="true" />
        <header className="bk-head">
          <div>
            <p className="bk-caption">(Կապ)</p>
            <h2 id="contact-title" className="bk-title">Կապ <span className="bk-serif">մեզ հետ</span></h2>
          </div>
          <button type="button" className="bk-close" aria-label="Փակել" onClick={() => close()}><X /></button>
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
        <p className="ct-address">{CLINIC.address}</p>
      </div>
    </div>
  );
}

/** The same contact cards, inline (used by the contact section on phones). */
export function ContactCards({ className = "" }: { className?: string }) {
  return (
    <ul className={`ct-list ${className}`}>
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
  );
}
