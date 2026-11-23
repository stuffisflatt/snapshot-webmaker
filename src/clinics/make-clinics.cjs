// Makes the clinic files from alphastom.json: only the name, header facts and contacts change.
// Facts come from the research of 2026-11-23 (Google Maps, spyur.am, Instagram, Facebook).
const fs = require("fs");
const base = JSON.parse(fs.readFileSync(__dirname + "/alphastom.json", "utf8"));
const seo = (founded, where = "Երևանում") => ({
  title: founded ? `{brand} Dental Clinic — Ատամնաբուժություն ${where}՝ {founded} թվականից` : `{brand} Dental Clinic — Ատամնաբուժություն ${where}`,
  description: base.seo.description,
  ogTitle: base.seo.ogTitle,
  ogDescription: founded ? `Ստոմատոլոգիական կլինիկա ${where}՝ {founded} թվականից։` : `Ստոմատոլոգիական կլինիկա ${where}։`,
  ogImage: base.seo.ogImage,
});
const clinics = [
  {
    slug: "armonia", name: "ARMONIA", brand: "Armonia", brandLocal: ["Արմո", "նիա"],
    headline: { swash: "A", left: "rm", right: "onia", sub: "Clinic" },
    founded: 2025, seo: seo(2025),
    contact: {
      address: "Չարենցի փ. 5, Կենտրոն, Երևան", addressLines: ["Երևան, Կենտրոն", "Չարենցի 5"],
      mobile: "+374 55 552025",
      instagram: "https://www.instagram.com/armoniaclinic_yerevan/", instagramHandle: "@armoniaclinic_yerevan",
      facebook: "https://www.facebook.com/profile.php?id=61580231044437",
      maps: "https://www.google.com/maps/place/Armonia+Clinic/@40.1839564,44.5276228,17z/data=!3m1!4b1!4m6!3m5!1s0x406abd001f5fb621:0x9873aa11c314ecc!8m2!3d40.1839564!4d44.5276228!16s%2Fg%2F11yxxv5k8b",
      bookingWhatsApp: "37455552025", hours: "Երկ–Ուրբ 09–20, Շբթ 09–17, Կիր 09–20",
    },
    rating: { value: "5.0", count: "44" },
    chip: "Ստոմատոլոգիա և էսթետիկա", value0: "Ատամնաբուժություն Երևանի կենտրոնում՝", locationNote: "Ձեր կողքին՝ {founded} թվականից",
  },
  {
    slug: "shams", name: "SHAMS", brand: "Shams", brandLocal: ["Շամ", "ս"],
    headline: { swash: "S", left: "ha", right: "ms", sub: "Dental Clinic", plainInitial: true, center: true, scale: 1.4 },
    seo: seo(null, "Արաբկիրում"),
    contact: {
      address: "Գեներալ Բաբայանի փ. 12, Արաբկիր, Երևան", addressLines: ["Երևան, Արաբկիր", "Գ. Բաբայանի 12"],
      mobile: "+374 98 255588", landline: "+374 10 255588",
      facebook: "https://www.facebook.com/ShamsDental",
      maps: "https://www.google.com/maps/place/Shams+Dental+Clinic/@40.1995709,44.5186826,17z/data=!3m1!4b1!4m6!3m5!1s0x406abd25dd009d67:0xc535dde4e2deb83f!8m2!3d40.1995709!4d44.5186826!16s%2Fg%2F11rxkym2lw",
      bookingWhatsApp: "37498255588", hours: "Երկ–Շբթ 09:00–21:00",
    },
    rating: { value: "4.8", count: "60" },
    chip: "Իմպլանտացիա · Մանկական", value0: "Ատամնաբուժություն Արաբկիրում՝", locationNote: "Ձեր կողքին՝ Արաբկիրում",
  },
  {
    slug: "dentex", name: "DENTEX", brand: "Dentex", brandLocal: ["Դենտ", "եքս"],
    headline: { swash: "D", left: "en", right: "tex", sub: "Dental Plus", center: true, shift: -10 },
    founded: 2015, seo: seo(2015),
    contact: {
      address: "Սայաթ-Նովա պող. 21/46, Կենտրոն, Երևան", addressLines: ["Երևան, Կենտրոն", "Սայաթ-Նովա 21/46"],
      mobile: "+374 93 546820",
      instagram: "https://www.instagram.com/dentexdentalplus/", instagramHandle: "@dentexdentalplus",
      facebook: "https://www.facebook.com/dentexdentalplus",
      maps: "https://www.google.com/maps/place/Dentex+Dental+%26+Aesthetic+Center/@40.1835685,44.5204962,17z/data=!3m1!4b1!4m6!3m5!1s0x406abd92a63de333:0x460bca0a3a6e2f9c!8m2!3d40.1835685!4d44.5204962!16s%2Fg%2F11rylkphq1",
      bookingWhatsApp: "37493546820", hours: "Երկ–Շբթ 09:00–20:00",
    },
    rating: { value: "4.6", count: "36" },
    chip: "10+ տարի փորձ", value0: "Ատամնաբուժություն Երևանի կենտրոնում՝", locationNote: "Ձեր կողքին՝ {founded} թվականից",
  },
  {
    slug: "venera", name: "VENERA", brand: "Venera", brandLocal: ["Վեն", "երա"],
    headline: { swash: "V", left: "en", right: "era", sub: "Dental Clinic", subShift: 15 },
    seo: seo(null),
    contact: {
      address: "Արգիշտի փ. 4/1, Երևան", addressLines: ["Երևան", "Արգիշտի 4/1"],
      mobile: "+374 94 844811",
      instagram: "https://www.instagram.com/veneradentalclinic/", instagramHandle: "@veneradentalclinic",
      maps: "https://www.google.com/maps/place/Venera/@40.1744656,44.5025535,17z/data=!3m1!4b1!4m6!3m5!1s0x406abd006032d095:0x958b0464034eec9a!8m2!3d40.1744656!4d44.5025535!16s%2Fg%2F11mshr0j6v",
      bookingWhatsApp: "37494844811", hours: "Երկ–Շբթ 09:00–21:30",
    },
    rating: { value: "5.0", count: "8" },
    chip: "Բարձրակարգ ծառայություն", value0: "Ատամնաբուժություն Երևանում՝", locationNote: "Ձեր կողքին՝ Արգիշտի փողոցում",
  },
  {
    slug: "ismile", name: "ISMILE", brand: "Ismile", brandLocal: ["Այ", "սմայլ"],
    headline: { swash: "I", left: "s", right: "mile", sub: "Dental Clinic", plainInitial: true, center: true, scale: 1.4, subShift: 25 },
    seo: seo(null),
    contact: {
      address: "Տիգրան Մեծի պող. 24, Երևան", addressLines: ["Երևան", "Տիգրան Մեծի 24"],
      mobile: "+374 44 811515",
      instagram: "https://www.instagram.com/ismile_aleqyan/", instagramHandle: "@ismile_aleqyan",
      maps: "https://www.google.com/maps/place/Aleqyan+Ismile+Dental+Clinic/@40.1677771,44.5132354,17z/data=!4m6!3m5!1s0x6ce5ebdaa27d722d:0x3e9a99644dbccced!8m2!3d40.1677771!4d44.5132354!16s%2Fg%2F11vz57ltg9",
      bookingWhatsApp: "37444811515", hours: "ամեն օր 09:00–00:00",
    },
    rating: { value: "5.0", count: "22" },
    chip: "Ամեն օր՝ 09:00–00:00", value0: "Ատամնաբուժություն Երևանում՝", locationNote: "Ձեր կողքին՝ Տիգրան Մեծի պողոտայում",
  },
];
for (const c of clinics) {
  const { chip, value0, locationNote, founded, ...top } = c;
  const out = { ...base, ...top };
  delete out.founded;
  if (founded) out.founded = founded;
  out.hero = { ...base.hero, value: [value0, ...base.hero.value.slice(1)], chips: [chip, ...base.hero.chips.slice(1)], locationNote };
  // Texts that name the founding year can't be used without one.
  if (!founded && JSON.stringify(out).includes("{founded}")) throw new Error(`${c.slug}: a text still uses {founded}`);
  fs.writeFileSync(`${__dirname}/${c.slug}.json`, JSON.stringify(out, null, 2) + "\n");
  console.log("wrote", c.slug);
}
