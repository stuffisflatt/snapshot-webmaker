// Editable clinic content. Confirm services, rating and doctors with the clinic before launch.
export const CLINIC = {
  name: "ALPHASTOM",
  address: "Պռոշյան փ. 28/2, Կենտրոն, Երևան",
  mobile: "+374 55 279227",
  mobileHref: "tel:+37455279227",
  landline: "+374 10 279227",
  landlineHref: "tel:+37410279227",
  instagram: "https://www.instagram.com/alphastom_mc/",
  // Replace with the clinic's Facebook page; until then this opens a Facebook search for the clinic.
  facebook: "https://www.facebook.com/search/top?q=Alphastom%20Dental%20Clinic",
  yandex: "https://yandex.com/maps/org/alphastom/33222583956/",
  rating: "4.8/5",
  ratingCount: "147+",
  founded: 2002,
  hours: "24/7",
  // Booking requests go to this WhatsApp number. It is a test number: it is only ever used inside
  // the wa.me link and must never be shown on the page.
  bookingWhatsApp: "37495997995",
};

export const FIRST_AVAILABLE = "Առաջին հասանելի մասնագետը";

// "from" is a typical starting price in AMD, shown as a guide; confirm the clinic's real prices.
export const SERVICES = [
  { id: "ortho", from: "300 000", title: "Օրթոդոնտիա և բրեկետներ", text: "Կծվածքի և ատամնաշարի դիրքի գնահատում, բրեկետ-համակարգերի ընտրություն և հետագա հսկողություն։" },
  { id: "implant", from: "200 000", title: "Իմպլանտացիա", text: "Կորսված ատամների վերականգնման տարբերակների քննարկում՝ նախնական զննումից և պլանավորումից հետո։" },
  { id: "endo", from: "15 000", title: "Ատամների բուժում և արմատախողովակներ", text: "Կարիեսի բուժում, լցոնում և արմատախողովակների բուժում՝ ըստ զննման արդյունքների։" },
  { id: "surgery", from: "10 000", title: "Վիրաբուժական ստոմատոլոգիա", text: "Ատամների հեռացում և այլ վիրաբուժական միջամտություններ՝ մասնագետի գնահատմամբ։" },
  { id: "prosth", from: "50 000", title: "Պսակներ և պրոթեզավորում", text: "Պսակների, կամուրջների և պրոթեզների տարբերակներ՝ ձեր դեպքին համապատասխան։" },
  { id: "hygiene", from: "15 000", title: "Հիգիենա և սպիտակեցում", text: "Մասնագիտական մաքրում, ատամնաքարի հեռացում և սպիտակեցման խորհրդատվություն։" },
];

// The booking sheet lists these doctors. Sample team, the same names as the doctors section
// (src/components/DoctorShowcase.tsx): replace both with the clinic's real doctors.
export const DOCTORS: { name: string; specialty: string }[] = [
  { name: "Անահիտ Սարգսյան", specialty: "Գլխավոր բժիշկ" },
  { name: "Արամ Հարությունյան", specialty: "Իմպլանտոլոգ" },
  { name: "Մարիամ Պետրոսյան", specialty: "Թերապևտ" },
  { name: "Հայկ Մանուկյան", specialty: "Վիրաբույժ" },
  { name: "Նարե Գրիգորյան", specialty: "Մանկական" },
  { name: "Դավիթ Ավետիսյան", specialty: "Օրթոպեդ" },
];
