import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SERVICES } from "@/lib/clinic";
import { riseStyle } from "@/components/Reveal";
import { rememberHomeSpot } from "@/lib/return-home";

/**
 * The six service categories as outlined cards over the section photo. Pointing at a card (or
 * focusing it) fills it light grey and unfolds a small "see more"; clicking opens that category's
 * own page. On touch screens, which cannot hover, the first tap unfolds the card and the second
 * opens the page.
 */
export function ServiceAccordion() {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const touch = useRef(false);

  // The section photo only starts downloading about two screens before the section, so it never
  // competes with the hero video on first load.
  useEffect(() => {
    const section = listRef.current?.closest<HTMLElement>("section");
    if (!section) return;
    touch.current = window.matchMedia("(hover: none)").matches;
    const near = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return;
      near.disconnect();
      section.dataset["bg"] = "on";
    }, { rootMargin: "200% 0px" });
    near.observe(section);
    return () => near.disconnect();
  }, []);

  // The whole services block keeps room at its bottom for the tallest open card, so unfolding one
  // never changes the block's height: the centred heading, the other cards and the photo behind
  // them all stay still, while the note under the cards follows them at its normal gap.
  useEffect(() => {
    const list = listRef.current;
    const block = list?.parentElement;
    if (!list || !block) return;
    const reserve = () => {
      block.style.minHeight = "";
      const open = list.querySelector<HTMLElement>('.service-item[data-open="true"] .service-panel');
      const closed = block.offsetHeight - (open?.offsetHeight ?? 0);
      const tallest = Math.max(0, ...[...list.querySelectorAll<HTMLElement>(".service-panel-content")].map(p => p.offsetHeight));
      block.style.minHeight = `${Math.ceil(closed + tallest)}px`;
      crop();
    };
    // The bottom of the section is cropped so the space under the pricing note equals the space
    // above the heading. It follows the note live, so an unfolded card is never hidden under the
    // next section. The section's own height never changes, so the photo stays put.
    const section = block.closest<HTMLElement>("section");
    const note = block.querySelector<HTMLElement>(".services-price-note");
    const heading = block.firstElementChild as HTMLElement | null;
    const offY = (el: HTMLElement) => {
      let y = 0, node: HTMLElement | null = el;
      while (node && node !== section) { y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      return y;
    };
    function crop() {
      if (!section || !note || !heading) return;
      const above = offY(heading);
      const below = section.offsetHeight - (offY(note) + note.offsetHeight);
      section.style.setProperty("--svc-crop", `${Math.max(0, Math.round(below - above))}px`);
    }
    reserve();
    void document.fonts?.ready.then(reserve);
    const grow = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => crop());
    grow?.observe(list);
    window.addEventListener("resize", reserve);
    return () => { grow?.disconnect(); window.removeEventListener("resize", reserve); };
  }, []);

  return (
    // Two columns sharing one open state: unfolding a card only grows its own column.
    <div ref={listRef} className="service-list" onMouseLeave={() => { if (!touch.current) setActive(null); }}>
      {[SERVICES.slice(0, 3), SERVICES.slice(3)].map((column, c) => (
      <ul key={c} className="service-col">
      {column.map((service, r) => {
        const open = active === service.id;
        return (
          <li key={service.id} className="service-item rise" style={riseStyle(2 + r * 2 + c)} data-open={open}
            onMouseEnter={() => { if (!touch.current) setActive(service.id); }}>
            <Link to="/services/$id" params={{ id: service.id }} viewTransition className="service-card"
              onFocus={() => setActive(service.id)}
              onBlur={() => setActive(current => (current === service.id ? null : current))}
              onClick={event => {
                // Touch: the first tap unfolds the card; the next one opens the page.
                if (touch.current && !open) { event.preventDefault(); setActive(service.id); return; }
                rememberHomeSpot();
              }}>
              <h3 className="service-trigger">
                <span>{service.title}</span><ChevronDown className="service-chevron" size={20} aria-hidden="true" />
              </h3>
              <div className="service-panel" aria-hidden={!open}>
                <div className="service-panel-clip">
                  <div className="service-panel-content">
                    <span className="service-more">Տեսնել ավելին<ArrowUpRight aria-hidden="true" /></span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
      </ul>
      ))}
    </div>
  );
}
