import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { openContact } from "@/components/ContactSheet";

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
      <button type="button" className="mobile-bar-call" aria-label="Կապ մեզ հետ" onClick={openContact}><Phone /></button>
    </div>
  );
}
