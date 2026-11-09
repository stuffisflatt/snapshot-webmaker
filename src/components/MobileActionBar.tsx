import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { CLINIC } from "@/lib/clinic";

/**
 * Phones only: booking and calling stay within thumb reach once the hero's own buttons have
 * scrolled away, and step aside at the contact section, which carries the same two actions.
 */
export function MobileActionBar({ onBook }: { onBook: () => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".clinic-hero");
    const contact = document.getElementById("contact");
    if (!hero || !contact) return;
    let pastHero = false, atContact = false;
    const update = () => setShown(pastHero && !atContact);
    const heroIo = new IntersectionObserver(([e]) => { pastHero = !(e?.isIntersecting ?? true); update(); }, { threshold: .15 });
    const contactIo = new IntersectionObserver(([e]) => { atContact = e?.isIntersecting ?? false; update(); });
    heroIo.observe(hero);
    contactIo.observe(contact);
    return () => { heroIo.disconnect(); contactIo.disconnect(); };
  }, []);

  return (
    <div className="mobile-bar" data-shown={shown} inert={!shown}>
      <button type="button" className="mobile-bar-book" onClick={onBook}><CalendarCheck />Ամրագրել այցը</button>
      <a className="mobile-bar-call" href={CLINIC.mobileHref} aria-label={`Զանգահարել ${CLINIC.mobile}`}><Phone /></a>
    </div>
  );
}
