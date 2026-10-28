import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Phone, CalendarCheck, ChevronDown, Star, MapPin, Instagram, ShieldCheck, Users, Clock3, ArrowUpRight } from "lucide-react";
import { CLINIC, DOCTORS } from "@/lib/clinic";
import { BookingSheet, type BookingPreset } from "@/components/BookingSheet";
import { StoryScroll } from "@/components/StoryScroll";
import { HeroHeader } from "@/components/HeroHeader";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import Team from "@/components/ui/team";
import { AnimatedTestimonials, type Testimonial } from "@/components/ui/animated-testimonials";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alphastom Dental Clinic — Ատամնաբուժություն Երևանում՝ 2002 թվականից" },
      { name: "description", content: "Բազմապրոֆիլ ստոմատոլոգիական կենտրոն Երևանում։ Օրթոդոնտիա, իմպլանտացիա, բուժում, հիգիենա։ Ամրագրեք այցը։" },
      { property: "og:title", content: "ALPHASTOM — Ատամնաբուժություն՝ անհատական մոտեցմամբ" },
      { property: "og:description", content: "Բազմապրոֆիլ ստոմատոլոգիական կենտրոն Երևանում՝ 2002 թվականից։" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "hy_AM" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))), { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Placeholder reviews (shown with a "Նմուշ" tag): no invented patient names. Swap for real ones.
const SAMPLE_REVIEWS: Testimonial[] = [
  { id: 1, sample: true, name: "Պացիենտ", role: "Հիգիենա և մաքրում", rating: 5,
    content: "Մասնագիտական մաքրումն անցավ հանգիստ և առանց ցավի։ Բժիշկը մանրամասն բացատրեց, թե ինչպես խնամել ատամները տանը։" },
  { id: 2, sample: true, name: "Պացիենտ", role: "Իմպլանտացիա", rating: 5,
    content: "Իմպլանտացիայից առաջ ամեն քայլը բացատրեցին պարզ լեզվով, և ես վստահ էի բուժման պլանին։ Արդյունքից շատ գոհ եմ։" },
  { id: 3, sample: true, name: "Պացիենտի ծնող", role: "Մանկական ստոմատոլոգիա", rating: 5,
    content: "Երեխայիս առաջին այցն էր, և թիմը շատ համբերատար էր։ Հիմա նա ինքն է ուզում նորից գալ։" },
];

const FAQ = [
  { q: "Ինչպե՞ս ամրագրել այցը", a: "Սեղմեք «Ամրագրել այցը», ընտրեք նախընտրելի ծառայությունը և ժամը, ապա ավարտեք ամրագրումն առցանց կամ զանգահարեք։ Կլինիկան կհաստատի այցը։" },
  { q: "Ինչ է լինում առաջին այցի ժամանակ", a: "Բժիշկը զննում է, քննարկում ձեր հարցերը և անհրաժեշտության դեպքում առաջարկում բուժման պլան։" },
  { q: "Որտե՞ղ է գտնվում կլինիկան", a: `${CLINIC.address}։ Ճանապարհը կարող եք տեսնել քարտեզի վրա։` },
  { q: "Ի՞նչ ծառայություններ եք մատուցում", a: "Օրթոդոնտիա, իմպլանտացիա, թերապևտիկ և վիրաբուժական ստոմատոլոգիա, պրոթեզավորում, հիգիենա։ Ճշգրտեք ձեր դեպքը զանգով։" },
];

function Index() {
  useReveal();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset>({});
  const [faq, setFaq] = useState<number | null>(0);
  const book = useCallback((p: BookingPreset = {}) => { setPreset(p); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="clinic-page">
      <main id="top">
        <HeroHeader onBook={() => book()} />

        {/* Trust */}
        <section aria-label="Փաստեր" className="clinic-facts">
          <ul>
            <li><Clock3 /><span>Հիմնադրված՝ 2002 թ.</span></li>
            <li><Users /><span>Բազմապրոֆիլ թիմ</span></li>
            <li>
              <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer">
                <Star /><span>{CLINIC.rating} · {CLINIC.ratingCount}+ գնահատական</span>
              </a>
            </li>
          </ul>
        </section>

        <StoryScroll videoSrc="/media/story.mp4" posterSrc="/media/story-poster.webp" />

        <div className="sky-zone">
          <div className="sky-ambient" aria-hidden="true"><span /><span /><span /><span /></div>
        {/* Services */}
        <section id="services" className="services-section scroll-mt-20 px-5 py-20">
          <div className="services-content mx-auto max-w-3xl">
          <h2 className="clinic-section-title">Ծառայություններ</h2>
          <p className="mt-3 text-muted-foreground">Ընտրեք ուղղությունը՝ մանրամասների համար։</p>
          <ServiceAccordion onBook={service => book({ service })} />
          </div>
        </section>

        <Team members={DOCTORS} />

        {/* Feedback. The reviews below are placeholders, tagged as samples on screen;
            replace them with real patient reviews (from the clinic's review page) before launch. */}
        <AnimatedTestimonials
          id="reviews"
          className="testimonials-section"
          title="Պացիենտների կարծիքները"
          subtitle="Ինչ են ասում մեզ մոտ բուժվողները՝ առաջին զննումից մինչև վերականգնված ժպիտ։"
          badgeText=""
          sampleLabel="Նմուշ"
          shareLabel="Կիսվել"
          dotLabel={index => `Կարծիք ${index + 1}`}
          testimonials={SAMPLE_REVIEWS}
          header={
            <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="review-rating flex items-center gap-4 rounded-2xl px-6 py-5 transition-colors">
              <span className="font-display text-5xl font-extrabold text-primary-deep">4.8</span>
              <span className="text-left"><span className="flex gap-0.5" aria-label="5-ից 4.8 աստղ">{[0,1,2,3,4].map((i) => <Star key={i} className="size-4 fill-primary text-primary" />)}</span>
                <span className="text-sm font-medium">Կարդալ բոլոր {CLINIC.ratingCount} կարծիքները</span></span>
              <ArrowUpRight className="ml-auto size-5" />
            </a>
          }
        />

        </div>

        {/* FAQ */}
        <section id="faq" className="faq-section scroll-mt-20">
          <div className="faq-content">
          <h2 className="reveal clinic-section-title">Հաճախ տրվող հարցեր</h2>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((f, i) => (
              <li key={i}>
                <Button variant="ghost" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)} className="h-auto whitespace-normal rounded-none flex w-full items-center justify-between gap-4 px-0 py-5 text-left font-semibold hover:bg-transparent hover:text-primary">
                  {f.q}<ChevronDown className={`size-5 shrink-0 transition-transform ${faq === i ? "rotate-180" : ""}`} />
                </Button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${faq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-muted-foreground"><span className="block pb-5">{f.a}</span></p>
                </div>
              </li>
            ))}
          </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact-section relative scroll-mt-16 overflow-hidden">
          <div className="contact-content relative mx-auto max-w-6xl px-5 py-20">
            <h2 className="reveal clinic-section-title max-w-xl">Պատրա՞ստ եք առաջին քայլին</h2>
            <p className="reveal mt-4 max-w-md text-lg opacity-90">Ընտրեք հարմար ժամը․ կլինիկան կկապվի ձեզ հետ՝ այցը հաստատելու համար։</p>
            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => book()} className="btn btn-white"><CalendarCheck className="size-5" />Ամրագրել այցը</Button>
              <a href={CLINIC.mobileHref} className="btn btn-ghost-white"><Phone className="size-5" />{CLINIC.mobile}</a>
            </div>
            <div className="contact-details mt-14 grid gap-4 sm:grid-cols-3">
              <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20">
                <MapPin className="size-6" /><p className="mt-3 font-semibold">{CLINIC.address}</p><p className="mt-1 text-sm opacity-80">Ճանապարհը քարտեզի վրա ↗</p>
              </a>
              <div className="rounded-xl bg-sky-foreground/10 p-5">
                <Phone className="size-6" />
                <a href={CLINIC.mobileHref} className="mt-3 block font-semibold hover:underline">{CLINIC.mobile}</a>
                <a href={CLINIC.landlineHref} className="mt-1 block font-semibold hover:underline">{CLINIC.landline}</a>
              </div>
              <a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20">
                <Instagram className="size-6" /><p className="mt-3 font-semibold">@alphastom_mc</p><p className="mt-1 text-sm opacity-80">Instagram ↗</p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="clinic-footer mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
        <span>© ALPHASTOM Dental Clinic · 2002</span>
        <span className="flex items-center gap-2"><ShieldCheck className="size-4" /><span className="rounded-sm border border-border px-2.5 py-0.5 text-xs font-medium">Concept preview</span></span>
      </footer>

      <BookingSheet open={open} preset={preset} onClose={close} />
    </div>
  );
}
