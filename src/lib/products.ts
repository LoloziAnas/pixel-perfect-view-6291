import { z } from "zod";

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

// One JSON file per product in src/content/products, edited from the admin page (/admin/,
// configured in public/admin/config.yml). The file name is the product's URL slug.
const productFile = z.object({
  order: z.number().nullish(),
  published: z.boolean().nullish(),
  name_fr: z.string().min(1),
  desc_fr: z.string().nullish(),
  name_ar: z.string().min(1),
  desc_ar: z.string().nullish(),
  price: z.number().positive(),
  image: z.string().min(1),
  colors: z
    .array(
      z.object({
        name_fr: z.string().min(1),
        name_ar: z.string().min(1),
        photo_box: z.string().min(1),
        photo_scene: z.string().min(1),
      }),
    )
    .nullish(),
  dims_fr: z.string().nullish(),
  dims_ar: z.string().nullish(),
});

// "Rose pêche" → "rose-peche": the color id kept in carts and orders.
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const files = import.meta.glob<unknown>("../content/products/*.json", {
  eager: true,
  import: "default",
});

export const products: Product[] = Object.entries(files)
  .flatMap(([path, raw]) => {
    const slug = path.replace(/^.*\/|\.json$/g, "");
    const r = productFile.safeParse(raw);
    // A broken file hides that one product instead of taking the whole shop down.
    if (!r.success) {
      console.error(`Invalid product file ${path}`, r.error.issues);
      return [];
    }
    const d = r.data;
    if (d.published === false) return [];
    const colors = d.colors?.length
      ? d.colors.map((c) => ({
          id: slugify(c.name_fr),
          fr: c.name_fr,
          ar: c.name_ar,
          imgs: [c.photo_box, c.photo_scene] as [string, string],
        }))
      : undefined;
    const product: Product & { order: number } = {
      slug,
      order: d.order ?? 100,
      img: d.image,
      price: d.price,
      fr: [d.name_fr, d.desc_fr ?? ""],
      ar: [d.name_ar, d.desc_ar ?? ""],
      ...(colors && { colors }),
      ...(d.dims_fr && { dims: { fr: d.dims_fr, ar: d.dims_ar || d.dims_fr } }),
    };
    return [product];
  })
  .sort((a, b) => a.order - b.order || a.fr[0].localeCompare(b.fr[0]))
  .map(({ order: _order, ...p }) => p);

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
