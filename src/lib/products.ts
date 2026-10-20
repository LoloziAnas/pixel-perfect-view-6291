import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import about from "@/assets/about.jpg";
import sultanPeche1 from "@/assets/sultan-peche-1.jpg";
import sultanPeche2 from "@/assets/sultan-peche-2.jpg";
import sultanCreme1 from "@/assets/sultan-creme-1.jpg";
import sultanCreme2 from "@/assets/sultan-creme-2.jpg";
import sultanBleu1 from "@/assets/sultan-bleu-1.jpg";
import sultanBleu2 from "@/assets/sultan-bleu-2.jpg";
import sultanRose1 from "@/assets/sultan-rose-1.jpg";
import sultanRose2 from "@/assets/sultan-rose-2.jpg";

// Absolute origin for share previews (og:image must be a full URL).
export const SITE_URL = "https://www.noauma.ma";

export const PHONE = "212674427340";
export const wa = (msg: string) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

export type ProductColor = {
  id: string;
  fr: string;
  ar: string;
  // Two photos per color: the boxed set, then the bedroom scene.
  imgs: [string, string];
};

export type Product = {
  slug: string;
  img: string;
  price: number;
  fr: [string, string];
  ar: [string, string];
  colors?: ProductColor[];
  // Dimensions shown on the product page and sent with the order.
  dims?: { fr: string; ar: string };
};

export const products: Product[] = [
  {
    slug: "sultan-velvet",
    img: sultanPeche2,
    price: 370,
    fr: ["Sultan Velvet", "Couverture velours double face, 3 pièces avec taies."],
    ar: ["سلطان فيلفيت", "بطانية مخمل بوجهين، 3 قطع مع أكياس وسائد."],
    colors: [
      {
        id: "rose-peche",
        fr: "Rose pêche",
        ar: "وردي خوخي",
        imgs: [sultanPeche1, sultanPeche2],
      },
      {
        id: "creme-elegant",
        fr: "Crème élégant",
        ar: "كريمي أنيق",
        imgs: [sultanCreme1, sultanCreme2],
      },
      {
        id: "bleu-clair",
        fr: "Bleu clair",
        ar: "أزرق فاتح",
        imgs: [sultanBleu1, sultanBleu2],
      },
      {
        id: "rose-poudre",
        fr: "Rose poudré",
        ar: "وردي بودرة",
        imgs: [sultanRose1, sultanRose2],
      },
    ],
    dims: {
      fr: "220 × 240 cm + 2 taies 50 × 75 cm",
      ar: "220 × 240 سم + 2 أكياس وسائد 50 × 75 سم",
    },
  },
  {
    slug: "matelasse-rose",
    img: p2,
    price: 650,
    fr: ["Matelassé Rose", "Coton matelassé, set avec taies."],
    ar: ["مبطّن وردي", "قطن مبطّن مع أكياس وسائد."],
  },
  {
    slug: "brode-fes",
    img: p3,
    price: 990,
    fr: ["Brodé Fès", "Coton ivoire brodé de fil doré."],
    ar: ["مطرّز فاس", "قطن عاجي مطرّز بخيط ذهبي."],
  },
  {
    slug: "lin-sable",
    img: p4,
    price: 780,
    fr: ["Lin Sable", "Parure en lin lavé, toucher naturel."],
    ar: ["كتان رملي", "طقم كتان مغسول بلمسة طبيعية."],
  },
  {
    slug: "plaid-nuage",
    img: p5,
    price: 420,
    fr: ["Plaid Nuage", "Polaire sherpa ultra douce."],
    ar: ["بطانية غيمة", "صوف شيربا فائق النعومة."],
  },
  {
    slug: "terracotta-soiree",
    img: about,
    price: 1150,
    fr: ["Terracotta Soirée", "Jeté chenille et parure assortie."],
    ar: ["تيراكوتا المساء", "غطاء شينيل مع طقم متناسق."],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const colorById = (p: Product, id: string | undefined) =>
  p.colors?.find((c) => c.id === id) ?? p.colors?.[0];

export type OrderLine = {
  slug: string;
  product: Product;
  qty: number;
  color?: string | undefined;
};
export type OrderInfo = {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

export const orderTotal = (lines: OrderLine[]) =>
  lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

// Always French: this message is read by the shop, whatever language the customer used.
export function orderMessage(lines: OrderLine[], info: OrderInfo, id: string) {
  return [
    `Nouvelle commande ${id}`,
    "",
    ...lines.map(
      (l) =>
        `• ${l.product.fr[0]}${l.color ? ` (${l.color})` : ""} × ${l.qty} — ${l.product.price * l.qty} MAD${l.product.dims ? `\n  ${l.product.dims.fr}` : ""}`,
    ),
    `Total : ${orderTotal(lines)} MAD (livraison gratuite)`,
    "",
    `Nom : ${info.name}`,
    `Téléphone : ${info.phone}`,
    `Adresse : ${info.address}`,
    `Ville : ${info.city}`,
    ...(info.notes ? [`Remarque : ${info.notes}`] : []),
  ].join("\n");
}
