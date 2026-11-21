import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarCheck, Phone } from "lucide-react";
import { riseStyle, useScrollReveal, WordReveal } from "@/components/Reveal";
import { CONFIG, SERVICES } from "@/lib/clinic";
import { BookingSheet } from "@/components/BookingSheet";
import { ContactSheet, openContact } from "@/components/ContactSheet";
import { DarkBackdrop } from "@/components/DarkBackdrop";
import { markReturnHome } from "@/lib/return-home";

/** One service category's own page: its full price list, in the services section's look. */
export const Route = createFileRoute("/services/$id")({
  loader: ({ params }) => {
    const index = SERVICES.findIndex(s => s.id === params.id);
    if (index < 0) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const service = loaderData ? SERVICES[loaderData.index] : undefined;
    return {
      meta: service ? [
        { title: `${service.title} — գներ · ${CONFIG.brand}` },
        { name: "description", content: service.text },
      ] : [],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  useScrollReveal();
  const { index } = Route.useLoaderData();
  const service = SERVICES[index]!;
  const others = SERVICES.filter(s => s.id !== service.id);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const preset = useMemo(() => ({ service: service.title }), [service.title]);
  // Each category opens at its top (the home page's smooth scroller can otherwise carry momentum in).
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [service.id]);

  return (
    <div className="clinic-page svc-page">
      {/* The same moving dark mesh as the results and reviews sections. */}
      <DarkBackdrop>
        <section className="svc-page-section">
          <nav className="svc-page-nav" aria-label="Նավիգացիա">
            {/* Back lands exactly where the visitor left the home page (see returnHome). */}
            <Link to="/" resetScroll={false} viewTransition className="svc-pill" onClick={markReturnHome}><ArrowLeft aria-hidden="true" />Ծառայություններ</Link>
            <span className="svc-page-count">{String(index + 1).padStart(2, "0")}/{String(SERVICES.length).padStart(2, "0")}</span>
          </nav>

          {/* key: the reveal replays when moving from one category to the next. */}
          <div key={service.id} className="svc-page-content" data-reveal>
            <header className="services-heading">
              <WordReveal as="h1" className="clinic-section-title" text={service.title} />
              <p className="rise" style={riseStyle(1)}>{service.text}</p>
            </header>

            <ul className="svc-rows" aria-label="Գներ">
              {service.items.map((item, i) => (
                <li key={item.name} className="svc-row rise" style={riseStyle(2 + i)}>
                  <span className="svc-row-name">{item.name}</span>
                  <span className="svc-row-price">{item.price} ֏</span>
                </li>
              ))}
            </ul>

            <p className="services-price-note svc-page-note rise" style={riseStyle(3 + service.items.length)}>Յուրաքանչյուր դեպք յուրահատուկ է, ուստի գինը որոշում ենք միասին՝ բաց և առանց անակնկալների։</p>

            <div className="svc-page-actions rise" style={riseStyle(4 + service.items.length)}>
              <button type="button" className="svc-pill svc-pill-solid" onClick={() => setOpen(true)}><CalendarCheck aria-hidden="true" />Ամրագրել այցը</button>
              <button type="button" className="svc-pill" onClick={openContact}><Phone aria-hidden="true" />Կապ մեզ հետ</button>
            </div>

            <div className="svc-page-others rise" style={riseStyle(5 + service.items.length)}>
              <p>Այլ ծառայություններ</p>
              <ul>
                {others.map(other => (
                  <li key={other.id}>
                    <Link to="/services/$id" params={{ id: other.id }} viewTransition className="svc-pill svc-pill-small">{other.title}<ArrowUpRight aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </DarkBackdrop>

      <BookingSheet open={open} preset={preset} onClose={close} />
      <ContactSheet />
    </div>
  );
}
