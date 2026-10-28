import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICES } from "@/lib/clinic";

export function ServiceAccordion({ onBook }: { onBook: (service: string) => void }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="service-list mt-8 space-y-3">
      {SERVICES.map(service => {
        const open = active === service.id;
        return (
          <li key={service.id} className="service-item" data-open={open}
            onKeyDown={event => { if (event.key === "Escape") setActive(null); }}>
            <h3>
              <button id={`svc-trigger-${service.id}`} className="service-trigger" aria-expanded={open} aria-controls={`svc-${service.id}`}
                onClick={() => setActive(current => current === service.id ? null : service.id)}>
                <span>{service.title}</span><ChevronDown className="service-chevron" size={20} />
              </button>
            </h3>
            <div id={`svc-${service.id}`} className="service-panel" role="region" aria-labelledby={`svc-trigger-${service.id}`} aria-hidden={!open} inert={!open}>
              <div className="service-panel-clip">
                <div className="service-panel-content">
                  <p className="text-muted-foreground">{service.text}</p>
                  <button className="btn btn-primary mt-4 text-sm" onClick={() => onBook(service.title)}>Ամրագրել այս ծառայության համար</button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
