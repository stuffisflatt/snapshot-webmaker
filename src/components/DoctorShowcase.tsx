import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwapText } from "@/components/HeroHeader";

// Sample profiles with AI-generated portraits. The one-line summaries, stats and credentials are
// realistic placeholders: replace every name, number and certificate with the clinic's real ones.
// creds: [university, year] · certification · languages spoken.
const DOCTORS = [
  { name: "Անահիտ Սարգսյան", role: "Գլխավոր բժիշկ", line: "Ղեկավարում է թիմն ու բարդ դեպքերը։",
    stats: ["23 տարվա փորձ", "12 000+ պացիենտ"], creds: ["ԵՊԲՀ, 2003", "Digital Smile Design", "Հայ · Ռուս · Անգլ"], specs: ["Ախտորոշում", "Բուժման պլան", "Խորհրդատվություն"] },
  { name: "Արամ Հարությունյան", role: "Ստոմատոլոգ-իմպլանտոլոգ", line: "Մեկ իմպլանտից մինչև ամբողջ ծնոտ։",
    stats: ["12 տարվա փորձ", "3 000+ իմպլանտ"], creds: ["ԵՊԲՀ, 2013", "Straumann սերտիֆիկատ", "Հայ · Ռուս"], specs: ["Իմպլանտացիա", "Ոսկրային պլաստիկա", "Վերականգնում"] },
  { name: "Մարիամ Պետրոսյան", role: "Ստոմատոլոգ-թերապևտ", line: "Փրկում է ատամները մանրադիտակի տակ։",
    stats: ["10 տարվա փորձ", "6 000+ բուժված ատամ"], creds: ["ԵՊԲՀ, 2015", "Մանրադիտակային էնդոդոնտիա", "Հայ · Ռուս · Անգլ"], specs: ["Կարիեսի բուժում", "Էնդոդոնտիա", "Լցոնում"] },
  { name: "Հայկ Մանուկյան", role: "Ստոմատոլոգ-վիրաբույժ", line: "Նուրբ հեռացում՝ հանգիստ ապաքինմամբ։",
    stats: ["14 տարվա փորձ", "5 000+ վիրահատություն"], creds: ["ԵՊԲՀ, 2011", "Պիեզովիրաբուժություն", "Հայ · Ռուս"], specs: ["Ատամի հեռացում", "Վիրաբուժություն", "Հսկողություն"] },
  { name: "Նարե Գրիգորյան", role: "Մանկական ստոմատոլոգ", line: "Առաջին այցը՝ հանգիստ ու առանց վախի։",
    stats: ["9 տարվա փորձ", "4 000+ փոքր պացիենտ"], creds: ["ԵՊԲՀ, 2016", "EAPD անդամ", "Հայ · Ռուս · Անգլ"], specs: ["Մանկական բուժում", "Կանխարգելում", "Հերմետիկացում"] },
  { name: "Դավիթ Ավետիսյան", role: "Օրթոպեդ-ստոմատոլոգ", line: "Պսակներ ու վինիրներ՝ ճիշտ կծվածքով։",
    stats: ["15 տարվա փորձ", "2 500+ պսակ և վինիր"], creds: ["ԵՊԲՀ, 2010", "Ivoclar սերտիֆիկատ", "Հայ · Ռուս · Անգլ"], specs: ["Պսակներ", "Պրոթեզավորում", "Վինիրներ"] },
].map((doctor, i) => ({ ...doctor, photo: `/team/doctor-${i + 1}.webp` }))
  // Shown order: Davit, Mariam, Hayk, Aram, Nare, Anahit.
  .map((_, i, all) => all[[5, 2, 3, 1, 4, 0][i]!]!);

const pad = (n: number) => String(n).padStart(2, "0");

export type Dir = "next" | "prev";

export function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Keeps the outgoing value on screen just long enough to roll it away. */
function useHandover<T>(value: T, ms = 1100) {
  const [state, setState] = useState({ current: value, previous: null as T | null, turn: 0 });
  useEffect(() => {
    if (Object.is(value, state.current)) return;
    setState(s => ({ current: value, previous: s.current, turn: s.turn + 1 }));
    const timer = window.setTimeout(() => setState(s => ({ ...s, previous: null })), ms);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return state;
}

function RollLine({ text, mode, byWord, delay }: { text: string; mode: "static" | "in" | "out"; byWord?: boolean | undefined; delay: number }) {
  let index = 0, key = 0;
  const words = text.split(" ");
  return (
    <span className="roll-line" data-mode={mode} aria-hidden={mode === "out" || undefined}>
      {words.map((word, w) => {
        const wordIndex = index;
        const chars = (word.match(/./gu) ?? []).map(char => {
          const i = byWord ? w : index++;
          return <span key={key++} className="roll-char" style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}>{char}</span>;
        });
        if (byWord) index = wordIndex + 1;
        return <span key={w}>{w > 0 && " "}<span className="roll-word">{chars}</span></span>;
      })}
    </span>
  );
}

/**
 * The hero's rotating-text motion applied to any text: letters (or words, for long copy) roll
 * out through a mask while the new text rolls in behind them, staggered left to right.
 */
export function Roll({ text, dir, byWord, delay = 0 }: { text: string; dir: Dir; byWord?: boolean; delay?: number }) {
  const { current, previous, turn } = useHandover(text);
  return (
    <span className="roll" data-dir={dir}>
      <RollLine key={`in-${turn}`} text={current} mode={turn ? "in" : "static"} byWord={byWord} delay={delay} />
      {previous !== null && <RollLine key={`out-${turn}`} text={previous} mode="out" byWord={byWord} delay={0} />}
    </span>
  );
}

/** Each portrait is its own card: the old card flies up off the screen while the next rises from below into its place. */
function PhotoRoll({ src, alt, dir }: { src: string; alt: string; dir: Dir }) {
  const { current, previous, turn } = useHandover(src);
  return (
    <div className="doc-photo" data-dir={dir}>
      <figure key={`in-${turn}`} className="doc-card" data-mode={turn ? "in" : "static"}><img src={current} alt={alt} width={800} height={898} /></figure>
      {previous !== null && <figure key={`out-${turn}`} className="doc-card" data-mode="out" aria-hidden="true"><img src={previous} alt="" width={800} height={898} /></figure>}
    </div>
  );
}

export function DoctorShowcase({ onBook }: { onBook: (doctor: string) => void }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Dir>("next");
  const doctor = DOCTORS[index]!;
  const last = DOCTORS.length - 1;
  const go = (to: number) => {
    if (to < 0 || to > last || to === index) return;
    setDir(to > index ? "next" : "prev");
    setIndex(to);
  };

  return (
    <section id="doctors" className="doc" aria-roledescription="carousel" aria-label="Մեր բժիշկները">
      <div className="doc-grid">
        <div className="doc-intro">
          <h2 className="doc-name"><span className="doc-title">Բժ․</span><Roll text={doctor.name} dir={dir} /></h2>
          <p className="doc-role"><Roll text={doctor.role} dir={dir} delay={60} /></p>
          <ul className="doc-stats" aria-label="Փորձ">
            {doctor.stats.map((stat, i) => <li key={i} className="doc-chip"><Roll text={stat} dir={dir} delay={120 + i * 50} /></li>)}
          </ul>
          <p className="doc-line"><Roll text={doctor.line} dir={dir} byWord delay={90} /></p>
        </div>
        <div className="doc-specs">
          <p className="doc-caption">(Մասնագիտացում)</p>
          <ul>{[0, 1, 2].map(i => <li key={i}><Roll text={doctor.specs[i] ?? ""} dir={dir} delay={90 + i * 50} /></li>)}</ul>
        </div>
        <PhotoRoll src={doctor.photo} alt={doctor.name} dir={dir} />
        <div className="doc-creds">
          <p className="doc-caption">(Կրթություն և լեզուներ)</p>
          <ul>{doctor.creds.slice(0, 2).map((cred, i) => <li key={i}><Roll text={cred} dir={dir} delay={80 + i * 50} /></li>)}</ul>
          <p className="doc-langs" aria-label={doctor.creds[2]}>{doctor.creds[2]!.split(" · ").map((lang, i) => <span key={i} aria-hidden="true">{i > 0 && <span className="doc-langs-bar">|</span>}{lang}</span>)}</p>
          <Button variant="ghost" className="clinic-hero-cta clinic-hero-cta-book doc-book" onClick={() => onBook(doctor.name)}><SwapText text="Ընտրել մասնագետին" hover="Ընտրել ժամը" /><ArrowUpRight /></Button>
        </div>
        <div className="doc-foot">
          <p className="doc-count" aria-live="polite"><Roll text={pad(index + 1)} dir={dir} />/{pad(DOCTORS.length)}</p>
          {/* Back appears from the second profile; forward disappears on the last, leaving only back. */}
          <div className="doc-nav">
            <button type="button" className="doc-arrow doc-prev" onClick={() => go(index - 1)} aria-label="Նախորդ բժիշկը" data-shown={index > 0} disabled={index === 0}>
              <span className="doc-next-arrows"><Arrow /><Arrow /></span>
            </button>
            <button type="button" className="doc-arrow doc-next" onClick={() => go(index + 1)} aria-label="Հաջորդ բժիշկը" data-shown={index < last} disabled={index === last}>
              <span className="doc-next-arrows"><Arrow /><Arrow /></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
