import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { riseStyle, useScrollReveal, WordReveal } from "@/components/Reveal";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { Phone, CalendarCheck, ChevronDown, MapPin, Instagram, ShieldCheck } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { BookingSheet, type BookingPreset } from "@/components/BookingSheet";
import { StoryScroll } from "@/components/StoryScroll";
import { StoryBackdrop } from "@/components/StoryBackdrop";
import { DoctorShowcase } from "@/components/DoctorShowcase";
import { HeroHeader } from "@/components/HeroHeader";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { DarkBackdrop } from "@/components/DarkBackdrop";
import { MobileActionBar } from "@/components/MobileActionBar";
import { ContactCards, ContactSheet } from "@/components/ContactSheet";
import { Highlights } from "@/components/Highlights";
import { Reviews, type Review } from "@/components/Reviews";
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

// Placeholder reviews (shown with a "Նմուշ" tag): no invented patient names. Swap for real ones.
const SAMPLE_REVIEWS: Review[] = [
  { id: 1, sample: true, name: "Պացիենտ", role: "Հիգիենա և մաքրում", rating: 5,
    content: "Մասնագիտական մաքրումն անցավ հանգիստ և առանց ցավի։ Բժիշկը մանրամասն բացատրեց, թե ինչպես խնամել ատամները տանը։" },
  { id: 2, sample: true, name: "Պացիենտ", role: "Իմպլանտացիա", rating: 5,
    content: "Իմպլանտացիայից առաջ ամեն քայլը բացատրեցին պարզ լեզվով, և ես վստահ էի բուժման պլանին։ Արդյունքից շատ գոհ եմ։" },
  { id: 3, sample: true, name: "Պացիենտի ծնող", role: "Մանկական ստոմատոլոգիա", rating: 5,
    content: "Երեխայիս առաջին այցն էր, և թիմը շատ համբերատար էր։ Հիմա նա ինքն է ուզում նորից գալ։" },
];



const FAQ = [
  { q: "Ինչպե՞ս ամրագրել այցը", a: "Սեղմեք «Ամրագրել այցը», ընտրեք ծառայությունը, օրը և ժամը, ապա ուղարկեք հայտը WhatsApp-ով կամ զանգահարեք։ Կլինիկան կհաստատի այցը։" },
  { q: "Ի՞նչ արժե առաջին այցը", a: "Առաջին խորհրդատվությունն ու զննումը սկսվում են 5 000 ֏-ից։ Բուժման արժեքը բժիշկը նախապես հաշվարկում և բացատրում է՝ մինչև որևէ քայլ սկսելը։" },
  { q: "Ցավո՞տ է", a: "Ոչ։ Բուժումն անցկացվում է ժամանակակից տեղային անզգայացմամբ, իսկ բժիշկը ամեն քայլից առաջ բացատրում է՝ ինչ է անելու։ Եթե անհանգստանում եք, պարզապես ասեք՝ կգնանք ձեր տեմպով։" },
  { q: "Ինչ է լինում առաջին այցի ժամանակ", a: "Բժիշկը զննում է, քննարկում ձեր հարցերը և անհրաժեշտության դեպքում առաջարկում բուժման պլան։" },
  { q: "Որտե՞ղ է գտնվում կլինիկան", a: `${CLINIC.address}։ Ճանապարհը կարող եք տեսնել քարտեզի վրա։` },
  { q: "Ի՞նչ ծառայություններ եք մատուցում", a: "Օրթոդոնտիա, իմպլանտացիա, թերապևտիկ և վիրաբուժական ստոմատոլոգիա, պրոթեզավորում, հիգիենա։ Ճշգրտեք ձեր դեպքը զանգով։" },
];

function Index() {
  useScrollReveal();
  useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset>({});
  const [faq, setFaq] = useState<number | null>(null);
  const book = useCallback((p: BookingPreset = {}) => { setPreset(p); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="clinic-page">
      <main id="top">
        <HeroHeader onBook={() => book()} />

        <StoryBackdrop>
          <StoryScroll videoSrc="/media/story.mp4" posterSrc="/media/story-poster.webp" onBook={() => book()} />
          <DoctorShowcase onBook={doctor => book({ doctor })} />
        </StoryBackdrop>

        <div className="sky-zone">
        {/* Services */}
        <section id="services" className="services-section scroll-mt-20 px-5 py-20">
          <div className="services-content mx-auto max-w-3xl" data-reveal>
          <div className="services-heading">
          <WordReveal className="clinic-section-title" text="Ծառայություններ" />
          <p className="rise mt-3 text-muted-foreground" style={riseStyle(1)}>Ընտրեք ուղղությունը՝ մանրամասների համար։</p>
          </div>
          <ServiceAccordion onBook={service => book({ service })} />
          </div>
        </section>




        </div>

        {/* Why us and patient reviews share one dark mesh; the red drifts across both.
            The reviews are placeholders, tagged as samples on screen: replace them before launch. */}
        <DarkBackdrop>
          <Highlights onBook={() => book()} />
          <Reviews reviews={SAMPLE_REVIEWS} rating="4.8" ratingCount={CLINIC.ratingCount} ratingHref={CLINIC.yandex} sampleLabel="Նմուշ" />
        </DarkBackdrop>

        {/* FAQ */}
        <section id="faq" className="faq-section scroll-mt-20">
          <div className="faq-content" data-reveal>
          <p className="m-caption rise" style={riseStyle(0)}>(Հարցեր)</p>
          <WordReveal className="clinic-section-title" text="Հաճախ տրվող հարցեր" />
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((f, i) => (
              <li key={i} className="rise" style={riseStyle(i + 2)}>
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
          <div className="contact-content relative mx-auto max-w-6xl px-5 py-20" data-reveal>
            <p className="contact-open rise" style={riseStyle(0)}>Բաց ենք {CLINIC.hours} · <span aria-hidden="true">★</span> 4.8 · {CLINIC.ratingCount} կարծիք</p>
            <WordReveal className="clinic-section-title max-w-xl" text="Պատրա՞ստ եք առաջին քայլին" />
            <p className="rise mt-4 max-w-md text-lg opacity-90" style={riseStyle(3)}>Ընտրեք հարմար ժամը․ կլինիկան կկապվի ձեզ հետ՝ այցը հաստատելու համար։</p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={riseStyle(4)}>
              <Button onClick={() => book()} className="btn btn-white"><CalendarCheck className="size-5" />Ամրագրել այցը</Button>
              <a href={CLINIC.mobileHref} className="btn btn-ghost-white"><Phone className="size-5" />{CLINIC.mobile}</a>
            </div>
            <ContactCards className="m-contact-cards rise" />
            <div className="contact-details mt-14 grid gap-4 sm:grid-cols-3">
              <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="rise rounded-xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20" style={riseStyle(5)}>
                <MapPin className="size-6" /><p className="mt-3 font-semibold">{CLINIC.address}</p><p className="mt-1 text-sm opacity-80">Ճանապարհը քարտեզի վրա ↗</p>
              </a>
              <div className="rise rounded-xl bg-sky-foreground/10 p-5" style={riseStyle(6)}>
                <Phone className="size-6" />
                <a href={CLINIC.mobileHref} className="mt-3 block font-semibold hover:underline">{CLINIC.mobile}</a>
                <a href={CLINIC.landlineHref} className="mt-1 block font-semibold hover:underline">{CLINIC.landline}</a>
              </div>
              <a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" className="rise rounded-xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20" style={riseStyle(7)}>
                <Instagram className="size-6" /><p className="mt-3 font-semibold">@alphastom_mc</p><p className="mt-1 text-sm opacity-80">Instagram ↗</p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer data-reveal className="clinic-footer mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
        <span className="rise">© ALPHASTOM Dental Clinic · 2002</span>
        <span className="rise flex items-center gap-2" style={riseStyle(1)}><ShieldCheck className="size-4" /><span className="rounded-sm border border-border px-2.5 py-0.5 text-xs font-medium">Concept preview</span></span>
      </footer>

      <MobileActionBar onBook={() => book()} />
      <BookingSheet open={open} preset={preset} onClose={close} />
      <ContactSheet />
    </div>
  );
}
