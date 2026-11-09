import { useEffect, useState, type CSSProperties } from "react";

// Sample profiles in the team section's order, with AI-generated portraits; replace names, bios and photos with the clinic's own.
const DOCTORS = [
  { name: "Անահիտ Սարգսյան", role: "Գլխավոր բժիշկ", bio: "Բժիշկ Սարգսյանն ունի ավելի քան 20 տարվա փորձ և ղեկավարում է կլինիկայի բժշկական թիմը։ Նա կարևորում է հանգիստ միջավայրը, պարզ բացատրությունները և կանխարգելումը։", specs: ["Ախտորոշում", "Բուժման պլան", "Խորհրդատվություն"] },
  { name: "Արամ Հարությունյան", role: "Ստոմատոլոգ-իմպլանտոլոգ", bio: "Բժիշկ Հարությունյանը 12 տարի զբաղվում է իմպլանտացիայով։ Նա յուրաքանչյուր քայլ պլանավորում է ռենտգենով և բացատրում պացիենտին մինչև բուժումը սկսելը։", specs: ["Իմպլանտացիա", "Ոսկրային պլաստիկա", "Վերականգնում"] },
  { name: "Մարիամ Պետրոսյան", role: "Ստոմատոլոգ-թերապևտ", bio: "Բժիշկ Պետրոսյանն ունի ավելի քան 10 տարվա փորձ և մասնագիտացած է անհատական բուժման մեջ։ Նա կարևորում է հանգիստ միջավայրը և բերանի խոռոչի հիգիենան։", specs: ["Կարիեսի բուժում", "Էնդոդոնտիա", "Լցոնում"] },
  { name: "Հայկ Մանուկյան", role: "Ստոմատոլոգ-վիրաբույժ", bio: "Բժիշկ Մանուկյանը կատարում է ատամների հեռացում և վիրաբուժական միջամտություններ՝ նվազագույն անհանգստությամբ և մանրակրկիտ հետբուժական հսկողությամբ։", specs: ["Ատամի հեռացում", "Վիրաբուժություն", "Հսկողություն"] },
  { name: "Նարե Գրիգորյան", role: "Մանկական ստոմատոլոգ", bio: "Բժիշկ Գրիգորյանն աշխատում է երեխաների հետ՝ առաջին այցը դարձնելով հանգիստ և ընկերական։ Նա ծնողներին սովորեցնում է տնային խնամքի պարզ կանոններ։", specs: ["Մանկական բուժում", "Կանխարգելում", "Հերմետիկացում"] },
  { name: "Դավիթ Ավետիսյան", role: "Օրթոպեդ-ստոմատոլոգ", bio: "Բժիշկ Ավետիսյանը վերականգնում է ատամների ձևն ու ֆունկցիան պսակներով և պրոթեզներով՝ ընտրելով տարբերակ յուրաքանչյուր դեպքի համար։", specs: ["Պսակներ", "Պրոթեզավորում", "Վինիրներ"] },
].map((doctor, i) => ({ ...doctor, photo: `/team/doctor-${i + 1}.webp` }))
  // Shown order: Davit, Mariam, Hayk, Aram, Nare, Anahit.
  .map((_, i, all) => all[[5, 2, 3, 1, 4, 0][i]!]!);

const pad = (n: number) => String(n).padStart(2, "0");

type Dir = "next" | "prev";

function Arrow() {
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
function Roll({ text, dir, byWord, delay = 0 }: { text: string; dir: Dir; byWord?: boolean; delay?: number }) {
  const { current, previous, turn } = useHandover(text);
  return (
    <span className="roll" data-dir={dir}>
      <RollLine key={`in-${turn}`} text={current} mode={turn ? "in" : "static"} byWord={byWord} delay={delay} />
      {previous !== null && <RollLine key={`out-${turn}`} text={previous} mode="out" byWord={byWord} delay={0} />}
    </span>
  );
}

/** The portrait slides through its frame the same way: the old one up and out, the new one up and in. */
function PhotoRoll({ src, alt, dir }: { src: string; alt: string; dir: Dir }) {
  const { current, previous, turn } = useHandover(src);
  return (
    <figure className="doc-photo" data-dir={dir}>
      <img key={`in-${turn}`} src={current} alt={alt} width={800} height={898} data-mode={turn ? "in" : "static"} />
      {previous !== null && <img key={`out-${turn}`} src={previous} alt="" aria-hidden="true" width={800} height={898} data-mode="out" />}
    </figure>
  );
}

export function DoctorShowcase() {
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
        </div>
        <div className="doc-specs">
          <p className="doc-caption">(Մասնագիտացում)</p>
          <ul>{[0, 1, 2].map(i => <li key={i}><Roll text={doctor.specs[i] ?? ""} dir={dir} delay={90 + i * 50} /></li>)}</ul>
        </div>
        <PhotoRoll src={doctor.photo} alt={doctor.name} dir={dir} />
        <p className="doc-bio"><Roll text={doctor.bio} dir={dir} byWord delay={80} /></p>
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
