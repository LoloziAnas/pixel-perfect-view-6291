import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import about from "@/assets/about.jpg";

// Absolute origin for share previews (og:image must be a full URL). Update if a custom domain is added.
export const SITE_URL = "https://pixel-perfect-view-6291.lovable.app";

export const PHONE = "212674427340";
export const wa = (msg: string) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

export type Product = {
  slug: string;
  img: string;
  price: number;
  fr: [string, string];
  ar: [string, string];
};

export const products: Product[] = [
  {
    slug: "velours-ivoire",
    img: p1,
    price: 890,
    fr: ["Velours Ivoire", "Velours doux bordé d'un galon doré."],
    ar: ["مخمل عاجي", "مخمل ناعم بحواف ذهبية."],
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

export type OrderLine = { product: Product; qty: number };
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
    ...lines.map((l) => `• ${l.product.fr[0]} × ${l.qty} — ${l.product.price * l.qty} MAD`),
    `Total : ${orderTotal(lines)} MAD (livraison gratuite)`,
    "",
    `Nom : ${info.name}`,
    `Téléphone : ${info.phone}`,
    `Adresse : ${info.address}`,
    `Ville : ${info.city}`,
    ...(info.notes ? [`Remarque : ${info.notes}`] : []),
  ].join("\n");
}
