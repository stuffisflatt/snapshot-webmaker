import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICES } from "@/lib/clinic";
import { Button } from "@/components/ui/button";

export function ServiceAccordion({ onBook }: { onBook: (service: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [lensMap, setLensMap] = useState<string>();

  // Build the displacement map once: neutral grey in the middle, ramping smoothly toward each edge so
  // the backdrop near the rim is pulled inward (R = horizontal, G = vertical), as a curved edge would.
  useEffect(() => {
    const w = 512, h = 160, rim = .22;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(w, h);
    const ramp = (t: number) => (t >= rim ? 0 : (1 + Math.cos((t / rim) * Math.PI)) / 2);
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1), dy = ramp(v) - ramp(1 - v);
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1), dx = ramp(u) - ramp(1 - u), i = (y * w + x) * 4;
        img.data[i] = 128 + dx * 127;
        img.data[i + 1] = 128 + dy * 127;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    setLensMap(canvas.toDataURL());
  }, []);

  // A soft shadow pool follows the pointer across each card, darkening the glass around it. Updates are
  // batched to one per frame and move the pool by transform only, so the card itself never repaints.
  const sheen = useRef({ frame: 0, card: null as HTMLElement | null, x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(sheen.current.frame), []);
  const tilt = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return;
    const s = sheen.current;
    s.card = event.currentTarget; s.x = event.clientX; s.y = event.clientY;
    if (s.frame) return;
    s.frame = requestAnimationFrame(() => {
      s.frame = 0;
      const card = s.card;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--glare-x", `${(s.x - box.left).toFixed(1)}px`);
      card.style.setProperty("--glare-y", `${(s.y - box.top).toFixed(1)}px`);
    });
  };

  return (
    <>
    {/* Curved-glass refraction for the cards: a lens map bends the backdrop strongly near each card's
        edges and leaves the middle flat, like a pane with rounded, thick edges. The red, green and blue
        channels bend by slightly different amounts, splitting colour along those edges. */}
    <svg className="glass-filter" aria-hidden="true" width="0" height="0">
      <filter id="glass-warp" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        {lensMap && <feImage href={lensMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="soft" />}
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="70" xChannelSelector="R" yChannelSelector="G" result="bentR" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G" result="bentG" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="50" xChannelSelector="R" yChannelSelector="G" result="bentB" />
        <feColorMatrix in="bentR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feColorMatrix in="bentG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="bentB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feComposite in="r" in2="g" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
        <feComposite in="rg" in2="b" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
      </filter>
    </svg>
    {/* Two independent columns sharing one open state: opening a card only grows its own column. */}
    <div className="service-list">
      {[SERVICES.slice(0, 3), SERVICES.slice(3)].map((column, c) => (
      <ul key={c} className="service-col">
      {column.map(service => {
        const open = active === service.id;
        return (
          <li key={service.id} className="service-item" data-open={open} onPointerMove={tilt}
            onKeyDown={event => { if (event.key === "Escape") setActive(null); }}>
            <h3>
              <Button variant="ghost" id={`svc-trigger-${service.id}`} className="service-trigger" aria-expanded={open} aria-controls={`svc-${service.id}`}
                onClick={() => setActive(current => current === service.id ? null : service.id)}>
                <span>{service.title}</span><ChevronDown className="service-chevron" size={20} />
              </Button>
            </h3>
            <div id={`svc-${service.id}`} className="service-panel" role="region" aria-labelledby={`svc-trigger-${service.id}`} aria-hidden={!open} inert={!open}>
              <div className="service-panel-clip">
                <div className="service-panel-content">
                  <p className="text-muted-foreground">{service.text}</p>
                  <Button className="btn btn-primary mt-4 text-sm" onClick={() => onBook(service.title)}>Ամրագրել այս ծառայության համար</Button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
      </ul>
      ))}
    </div>
    </>
  );
}
