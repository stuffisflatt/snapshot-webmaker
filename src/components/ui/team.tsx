import { Marquee } from "@/components/ui/marquee";
import { CurvedTeam } from "@/components/ui/curved-team";

export type TeamMember = { name: string; specialty: string; photo: string; photoSrcSet?: string };

const sampleMembers: TeamMember[] = [
  { name: "Անահիտ Սարգսյան", specialty: "Գլխավոր բժիշկ" },
  { name: "Արամ Հարությունյան", specialty: "Ստոմատոլոգ-իմպլանտոլոգ" },
  { name: "Մարիամ Պետրոսյան", specialty: "Ստոմատոլոգ-թերապևտ" },
  { name: "Հայկ Մանուկյան", specialty: "Ստոմատոլոգ-վիրաբույժ" },
  { name: "Նարե Գրիգորյան", specialty: "Մանկական ստոմատոլոգ" },
  { name: "Դավիթ Ավետիսյան", specialty: "Օրթոպեդ-ստոմատոլոգ" },
].map((member, index) => ({
  ...member,
  photo: `/team/sample-${index + 1}-gray-512.webp`,
  photoSrcSet: `/team/sample-${index + 1}-gray-512.webp 512w, /team/sample-${index + 1}-gray-768.webp 768w`,
}));

export default function Team({ members = [] }: { members?: TeamMember[] }) {
  const isSample = members.length === 0;
  const profiles = isSample ? sampleMembers : members;
  const lead = profiles[0];
  return (
    <section id="team" className="team-introduction" aria-labelledby="team-heading">
      <svg className="team-bottom-decoration" fill="none" viewBox="0 0 460 154" aria-hidden="true">
        <path d="M-87 458C-102 348-77 239-15 188C57 129 181 150 352 341C278-374 634 381 548 43" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40" />
      </svg>
      <div className="team-intro-heading">
        <div className="team-heading-copy">
        <h2 id="team-heading" className="clinic-section-title">Մեր մասնագետները
        </h2>
        <p>Բազմապրոֆիլ թիմ՝ ձեր ժպիտի առողջության համար։</p>
        </div>
      </div>

      {/* Desktop: curved, draggable carousel. Phones keep the flat marquee for now. */}
      <CurvedTeam members={profiles} isSample={isSample} />
      <Marquee className="team-marquee-phone">
        {profiles.map((member, index) => (
          <article className="team-profile" key={`${member.photo}-${index}`}>
            <div className="team-profile-photo">
              <img src={member.photo} srcSet={member.photoSrcSet} sizes="(max-width: 600px) 220px, 256px" alt={isSample ? `Նմուշային դիմանկար ${index + 1}` : member.name} width={256} height={368} loading="eager" decoding="async" />
              <div className="team-profile-caption"><h3>{member.name}</h3><p>{member.specialty}</p></div>
            </div>
          </article>
        ))}
      </Marquee>

      <figure className="team-intro-footer">
        <div>
          {lead && <figcaption className="team-lead"><h3>{lead.name}</h3><span>{lead.specialty} · Alphastom</span></figcaption>}
          <blockquote>«Յուրաքանչյուր ժպիտի հետևում անհատական պատմություն է։ Մեր նպատակը հոգատար մոտեցմամբ ձեր ժպիտի առողջությունն ու գեղեցկությունը պահպանելն է։»</blockquote>
        </div>
      </figure>
    </section>
  );
}
