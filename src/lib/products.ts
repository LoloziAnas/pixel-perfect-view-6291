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

export type SizeId = "1p" | "2p" | "queen" | "king";

// Standard mattress sizes sold in Morocco (same as the European/French ones), in cm.
export const BED_SIZES: { id: SizeId; fr: string; ar: string; bed: string }[] = [
  { id: "1p", fr: "1 place", ar: "لشخص واحد", bed: "90×190" },
  { id: "2p", fr: "2 places", ar: "لشخصين", bed: "140×190" },
  { id: "queen", fr: "Queen", ar: "كوين", bed: "160×200" },
  { id: "king", fr: "King", ar: "كينغ", bed: "180×200" },
];

export type ProductKind = "bedspread" | "duvet" | "throw";

// Typical finished dimensions (cm) per bed size. Indicative: check against the real stock.
export const COVER_DIMS: Record<Exclude<ProductKind, "throw">, Record<SizeId, string>> = {
  bedspread: { "1p": "180×250", "2p": "240×260", queen: "260×260", king: "280×280" },
  duvet: { "1p": "140×200", "2p": "220×240", queen: "240×260", king: "260×240" },
};

const ALL_SIZES = BED_SIZES.map((s) => s.id);

export type Product = {
  slug: string;
  img: string;
  /** Price in MAD; also the price of any size missing from `sizePrices`. */
  price: number;
  kind: ProductKind;
  /** Bed sizes offered; omit for one-size items. */
  sizes?: SizeId[];
  /** Per-size prices, e.g. { "1p": 690, king: 1090 }. */
  sizePrices?: Partial<Record<SizeId, number>>;
  fr: [string, string];
  ar: [string, string];
};

export const products: Product[] = [
  {
    slug: "velours-ivoire",
    img: p1,
    price: 890,
    kind: "bedspread",
    sizes: ALL_SIZES,
    fr: ["Velours Ivoire", "Velours doux bordé d'un galon doré."],
    ar: ["مخمل عاجي", "مخمل ناعم بحواف ذهبية."],
  },
  {
    slug: "matelasse-rose",
    img: p2,
    price: 650,
    kind: "bedspread",
    sizes: ALL_SIZES,
    fr: ["Matelassé Rose", "Coton matelassé, set avec taies."],
    ar: ["مبطّن وردي", "قطن مبطّن مع أكياس وسائد."],
  },
  {
    slug: "brode-fes",
    img: p3,
    price: 990,
    kind: "bedspread",
    sizes: ALL_SIZES,
    fr: ["Brodé Fès", "Coton ivoire brodé de fil doré."],
    ar: ["مطرّز فاس", "قطن عاجي مطرّز بخيط ذهبي."],
  },
  {
    slug: "lin-sable",
    img: p4,
    price: 780,
    kind: "duvet",
    sizes: ALL_SIZES,
    fr: ["Lin Sable", "Parure en lin lavé, toucher naturel."],
    ar: ["كتان رملي", "طقم كتان مغسول بلمسة طبيعية."],
  },
  {
    slug: "plaid-nuage",
    img: p5,
    price: 420,
    kind: "throw",
    fr: ["Plaid Nuage", "Polaire sherpa ultra douce."],
    ar: ["بطانية غيمة", "صوف شيربا فائق النعومة."],
  },
  {
    slug: "terracotta-soiree",
    img: about,
    price: 1150,
    kind: "bedspread",
    sizes: ALL_SIZES,
    fr: ["Terracotta Soirée", "Jeté chenille et parure assortie."],
    ar: ["تيراكوتا المساء", "غطاء شينيل مع طقم متناسق."],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const sizeInfo = (id: SizeId) => BED_SIZES.find((s) => s.id === id)!;

export const defaultSize = (p: Product): SizeId | undefined =>
  p.sizes?.includes("2p") ? "2p" : p.sizes?.[0];

export const unitPrice = (p: Product, size?: SizeId) => (size && p.sizePrices?.[size]) || p.price;

export const minPrice = (p: Product) =>
  Math.min(...(p.sizes ?? [undefined]).map((s) => unitPrice(p, s)));

export const hasPriceRange = (p: Product) =>
  new Set((p.sizes ?? []).map((s) => unitPrice(p, s))).size > 1;

export type OrderLine = { product: Product; qty: number; size?: SizeId | undefined };

export const lineTotal = (l: OrderLine) => unitPrice(l.product, l.size) * l.qty;
export type OrderInfo = {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

export const orderTotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);

// Always French: this message is read by the shop, whatever language the customer used.
export function orderMessage(lines: OrderLine[], info: OrderInfo) {
  return [
    "Bonjour NOAUMA, nouvelle commande :",
    ...lines.map((l) => {
      const size = l.size && sizeInfo(l.size);
      const label = size ? ` (${size.fr}, lit ${size.bed})` : "";
      return `• ${l.product.fr[0]}${label} × ${l.qty} — ${lineTotal(l)} MAD`;
    }),
    `Total : ${orderTotal(lines)} MAD (livraison gratuite)`,
    "",
    `Nom : ${info.name}`,
    `Téléphone : ${info.phone}`,
    `Adresse : ${info.address}`,
    `Ville : ${info.city}`,
    ...(info.notes ? [`Remarque : ${info.notes}`] : []),
  ].join("\n");
}
