import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { openContact } from "@/components/ContactSheet";

/**
 * Phones only: booking and calling stay within thumb reach from the services section on, and step aside at the contact section, which carries the same two actions.
 */
export function MobileActionBar({ onBook }: { onBook: () => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const services = document.getElementById("services");
    const contact = document.getElementById("contact");
    if (!services || !contact) return;
    // The bar arrives once the services section fills half the screen (the story and doctors carry
    // their own buttons) and leaves while the contact section is in view.
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = window.innerHeight, c = contact.getBoundingClientRect();
      const reached = services.getBoundingClientRect().top < h * .5;
      const atContact = c.top < h && c.bottom > 0;
      setShown(reached && !atContact);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <div className="mobile-bar" data-shown={shown} inert={!shown}>
      <button type="button" className="mobile-bar-book" onClick={onBook}><CalendarCheck />Ամրագրել այցը</button>
      <button type="button" className="mobile-bar-call" aria-label="Կապ մեզ հետ" onClick={openContact}><Phone /></button>
    </div>
  );
}
