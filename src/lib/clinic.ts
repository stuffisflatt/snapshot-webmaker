// Editable clinic content. Confirm services, rating and doctors with the clinic before launch.
export const CLINIC = {
  name: "ALPHASTOM",
  address: "Պռոշյան փ. 28/2, Կենտրոն, Երևան",
  mobile: "+374 55 279227",
  mobileHref: "tel:+37455279227",
  landline: "+374 10 279227",
  landlineHref: "tel:+37410279227",
  instagram: "https://www.instagram.com/alphastom_mc/",
  yandex: "https://yandex.com/maps/org/alphastom/33222583956/",
  rating: "4.8/5",
  ratingCount: 149,
  founded: 2002,
};

export const FIRST_AVAILABLE = "Առաջին հասանելի մասնագետը";

export const SERVICES = [
  { id: "ortho", title: "Օրթոդոնտիա և բրեկետներ", text: "Կծվածքի և ատամնաշարի դիրքի գնահատում, բրեկետ-համակարգերի ընտրություն և հետագա հսկողություն։" },
  { id: "implant", title: "Իմպլանտացիա", text: "Կորսված ատամների վերականգնման տարբերակների քննարկում՝ նախնական զննումից և պլանավորումից հետո։" },
  { id: "endo", title: "Ատամների բուժում և արմատախողովակներ", text: "Կարիեսի բուժում, լցոնում և արմատախողովակների բուժում՝ ըստ զննման արդյունքների։" },
  { id: "surgery", title: "Վիրաբուժական ստոմատոլոգիա", text: "Ատամների հեռացում և այլ վիրաբուժական միջամտություններ՝ մասնագետի գնահատմամբ։" },
  { id: "prosth", title: "Պսակներ և պրոթեզավորում", text: "Պսակների, կամուրջների և պրոթեզների տարբերակներ՝ ձեր դեպքին համապատասխան։" },
  { id: "hygiene", title: "Հիգիենա և սպիտակեցում", text: "Մասնագիտական մաքրում, ատամնաքարի հեռացում և սպիտակեցման խորհրդատվություն։" },
];

// Add confirmed doctors here: { name, specialty, photo }
export const DOCTORS: { name: string; specialty: string; photo: string }[] = [];
