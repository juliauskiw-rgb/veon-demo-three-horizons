// Client facts for the homepage. Source: veon/client.json (company.contacts, socials)
// and audit/notes/site-dom.json (texts of services, first visit, reviews). Nothing invented.

export const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const asset = (path: string): string => `${base}${path.replace(/^\//, "")}`;

export const FUTURE_NOTE = "Розділ у розробці";

export const contacts = {
  phoneHref: "tel:+380678889832",
  phoneText: "+38 (067) 888-98-32",
  telegram: "https://t.me/drvelychko",
  emailHref: "mailto:drvelychko@gmail.com",
  email: "drvelychko@gmail.com",
  city: "м. Київ",
  street: "вул. Михайла Бойчука, 1/2",
  metro: "метро Звіринецька",
  map: "https://maps.app.goo.gl/nVCpTZMVg4gvEZef7",
} as const;

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/_ortopedia.vip/" },
  { name: "Facebook", href: "https://www.facebook.com/dr.Velychko/" },
  { name: "TikTok", href: "https://www.tiktok.com/@.ortopedia.vip", rec: "R-009" },
  { name: "YouTube", href: "https://www.youtube.com/@dr.velychko" },
] as const;

export const nav = [
  { href: "#services", label: "Послуги" },
  { href: "#first-visit", label: "Прийом і ціни" },
  { href: "#likar", label: "Лікар" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#contacts", label: "Контакти" },
] as const;

export const firstVisitSteps = [
  "Консультація та огляд",
  "Діагностика (включаючи УЗД)",
  "Постановка точного діагнозу",
  "Призначення схеми лікування",
  "Початок лікування вже на першому прийомі (за бажанням пацієнта)",
] as const;

export interface Photo {
  name: string;
  small: number[]; // [w, h] of the 480 file
  large: [string, number, number]; // suffix, w, h
  alt: string;
}

export interface ServiceGroup {
  id: string;
  tab: string;
  title: string;
  lead: string;
  items: string[];
  photo: Photo;
  mobilePhoto?: boolean;
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: "services-spine",
    tab: "Спина та шия",
    title: "Лікування болю в спині та шиї",
    lead: "Ми лікуємо не симптоми, а причину болю: знаходимо джерело проблеми та одразу починаємо лікування.",
    items: [
      "Лікування болю в спині",
      "Лікування болю в шиї",
      "Вертебрологія, остеопатія, мануальна корекція хребта",
    ],
    photo: {
      name: "back-exam",
      small: [480, 585],
      large: ["747", 747, 910],
      alt: "Лікар оглядає спину пацієнтки та оцінює лінію лопаток",
    },
  },
  {
    id: "services-joints",
    tab: "Суглоби",
    title: "Ін'єкції в суглоби під УЗД і PRP",
    lead: "Кожна маніпуляція та ін'єкція проводиться під візуальним контролем УЗД — не «наосліп».",
    items: [
      "Ін'єкції в суглоби — інтервенційна ортопедія",
      "Введення препаратів гіалуронової кислоти в усі суглоби під УЗД, блокади",
      "Плазмотерапія PRP",
      "Відновлення рухливості суглобів без операцій",
    ],
    photo: {
      name: "joint-injection-ultrasound",
      small: [480, 640],
      large: ["800", 800, 1067],
      alt: "Лікар Величко виконує ін'єкцію в суглоб під контролем апарата УЗД",
    },
    mobilePhoto: true,
  },
  {
    id: "services-kids",
    tab: "Діти від 5 років",
    title: "Дитячий ортопед — діти від 5 років",
    lead: "Постава, сколіоз, різна довжина ніг і хода дитини — консервативно, без операцій.",
    items: [
      "Лікування дітей від 5 років",
      "Комплексне відновлення постави у дорослих і дітей",
      "Профілактика розвитку сколіозу у дітей",
      "Лікування анізомелії — різної довжини ніг",
      "Лікування «качиної ходи»",
    ],
    photo: {
      name: "posture-exam",
      small: [480, 640],
      large: ["700", 700, 933],
      alt: "Лікар Величко оцінює поставу пацієнта стоячи",
    },
  },
  {
    id: "services-sport",
    tab: "Спортсмени",
    title: "Лікування спортсменів",
    lead: "Методи реабілітації професійних атлетів — для пацієнтів будь-якого віку, дорослих і дітей від 5 років.",
    items: ["Лікування спортсменів — дорослих і дітей від 5 років", "Ударно-хвильова терапія (УХТ)"],
    photo: {
      name: "shockwave-therapy",
      small: [480, 640],
      large: ["700", 700, 933],
      alt: "Ударно-хвильова терапія стопи",
    },
  },
];

export const alsoInPractice = [
  "Ботулінотерапія в ортопедії",
  "Апаратний інфрачервоний масаж",
  "Консультація дорослих і дітей",
] as const;

export interface Review {
  author: string;
  text: string;
  lang: "uk" | "ru";
}

// Texts exactly as on the client's site (patients' words are not edited); truncated ones keep «…».
export const reviews: Review[] = [
  {
    author: "Raisa Ganzha",
    lang: "uk",
    text: "Читала багато відгуків як гарних так і поганих.Маю артроз 3 ступіню колінного суглобу,до операції не готова.Вже після першої ін’єкції гіалуроновоі кислоти і колагену -коліно перестало хрустіти,після другої ін’єкції ,я можу розігнути ногу повністю,про біль забула…",
  },
  {
    author: "Kyrylo Manakhov",
    lang: "ru",
    text: "Отличный травматолог. Я был удивлен, когда нашел его через гугл карты и потом еще увидел количество положительных отзывов. Я обратился к врачу после воспаления голеностопа.",
  },
  {
    author: "Олексій Курило",
    lang: "uk",
    text: "Виражаю свою вдячність Вячеславу Миколайовичу, за його багатогранний та професійний погляд на хвороби. Мало хто з лікарів при вирішенні проблем з опорно-руховим аппаратом звертають увагу та режим життідіяльності людини, особливо харчування…",
  },
  {
    author: "Valera Dobrodeev",
    lang: "ru",
    text: "Пришел сделать диагностику позвоночника, так как есть небольшой сколиоз. Доктор сначала сделал осмотр , оценил искривление, потом сделал остеопатию структуры тела: получился типа массаж: позвоночник, шея хрустели. Приеду ещё.",
  },
];
