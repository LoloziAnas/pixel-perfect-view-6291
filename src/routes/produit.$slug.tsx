import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Banknote, Ruler, ShoppingBag, Truck, Zap } from "lucide-react";
import logo from "@/assets/logo.webp";
import { CartButton, LangToggle, QtyStepper } from "@/components/shop";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import {
  BED_SIZES,
  COVER_DIMS,
  defaultSize,
  hasPriceRange,
  minPrice,
  products,
  productBySlug,
  SITE_URL,
  unitPrice,
  type Product,
  type SizeId,
} from "@/lib/products";
import { shopText, type ShopText } from "@/lib/shop-text";
import type { Lang } from "@/lib/lang";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData }) => {
    const p = productBySlug(loaderData?.slug ?? "");
    const title = p ? `${p.fr[0]} — NOAUMA` : "Produit — NOAUMA";
    const desc = p
      ? `${p.fr[1]} ${p.price} MAD, livraison gratuite partout au Maroc.`
      : "Linge de lit premium NOAUMA.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(p
          ? [
              { property: "og:image", content: `${SITE_URL}${p.img}` },
              { name: "twitter:image", content: `${SITE_URL}${p.img}` },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  errorComponent: () => <Missing />,
  notFoundComponent: () => <Missing />,
});

function Missing() {
  const [lang] = useLang();
  const s = shopText[lang];
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <h1 className="text-4xl text-ink">{s.notFound}</h1>
        <Link to="/" className="btn-primary mt-6">
          {s.backHome}
        </Link>
      </div>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = productBySlug(slug) as Product;
  // Keyed so quantity resets when moving between products via "Vous aimerez aussi".
  return <ProductView key={p.slug} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const [lang] = useLang();
  const s = shopText[lang];
  const { add, setDrawerOpen, startCheckout } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<SizeId | undefined>(defaultSize(p));
  const [name, desc] = p[lang];

  const i = products.indexOf(p);
  const related = [1, 2, 3].map((k) => products[(i + k) % products.length]!);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-ink py-2 text-center text-[0.65rem] uppercase tracking-[0.2em] text-cream">
        {s.topBar}
      </div>
      <header className="border-b border-gold/15">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {s.home}
          </Link>
          <Link to="/">
            <img src={logo} alt="Logo NOAUMA" width={64} height={64} className="h-16 w-16" />
          </Link>
          <div className="flex items-center justify-end gap-2">
            <LangToggle />
            <CartButton />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img
            src={p.img}
            alt={name}
            width={800}
            height={1000}
            className="aspect-[4/5] h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">NOAUMA · Kenitra</p>
          <h1 className="mt-3 text-5xl text-ink md:text-6xl">{name}</h1>
          <p className="mt-4 font-serif text-3xl text-rose-deep">
            {unitPrice(p, size)} {s.mad}
          </p>
          <p className="mt-4 text-muted-foreground">{desc}</p>

          {p.sizes && size ? (
            <SizePicker p={p} value={size} onChange={setSize} lang={lang} s={s} />
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">{s.oneSize}</p>
          )}

          <div className="mt-6">
            <QtyStepper value={qty} onChange={setQty} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                add({ slug: p.slug, size }, qty);
                setDrawerOpen(true);
              }}
              className="btn-ghost !py-4 text-rose-deep"
            >
              <ShoppingBag className="h-4 w-4" /> {s.addToCart}
            </button>
            <button
              type="button"
              onClick={() => startCheckout([{ slug: p.slug, size, qty }], false)}
              className="btn-primary !py-4"
            >
              <Zap className="h-4 w-4" /> {s.buyNow}
            </button>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-gold" /> {s.freeDelivery}
            </li>
            <li className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-gold" /> {s.cod}
            </li>
          </ul>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl text-ink md:text-4xl">{s.related}</h2>
          <div className="gold-line mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {related.map((r, idx) => (
            <Link
              key={r.slug}
              to="/produit/$slug"
              params={{ slug: r.slug }}
              className={`group overflow-hidden rounded-2xl bg-card shadow-soft ${idx === 2 ? "max-md:hidden" : ""}`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={r.img}
                  alt={r[lang][0]}
                  loading="lazy"
                  width={800}
                  height={1008}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 md:p-5">
                <span className="font-serif text-lg text-ink md:text-xl">{r[lang][0]}</span>
                <span className="shrink-0 text-sm text-rose-deep">
                  {hasPriceRange(r) && `${s.from} `}
                  {minPrice(r)} {s.mad}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SizePicker({
  p,
  value,
  onChange,
  lang,
  s,
}: {
  p: Product;
  value: SizeId;
  onChange: (size: SizeId) => void;
  lang: Lang;
  s: ShopText;
}) {
  const sizes = BED_SIZES.filter((b) => p.sizes?.includes(b.id));
  const dims = p.kind === "throw" ? undefined : COVER_DIMS[p.kind];

  return (
    <div className="mt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/70">{s.size}</p>
      <div role="radiogroup" aria-label={s.size} className="mt-3 grid grid-cols-2 gap-2">
        {sizes.map((b) => {
          const selected = b.id === value;
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(b.id)}
              className={`rounded-xl border px-3 py-2.5 text-start transition-colors ${
                selected
                  ? "border-rose-deep bg-rose-deep/5 text-ink"
                  : "border-gold/40 text-ink/80 hover:border-gold"
              }`}
            >
              <span className="block text-sm font-medium">{b[lang]}</span>
              <span className="block text-xs text-muted-foreground">{s.bedFor(b.bed)}</span>
            </button>
          );
        })}
      </div>

      {dims && (
        <details className="group mt-3 text-sm">
          <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-xs uppercase tracking-[0.15em] text-rose-deep">
            <Ruler className="h-4 w-4" /> {s.sizeGuide}
          </summary>
          <table className="mt-3 w-full text-start text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 text-start font-normal">{s.guideSize}</th>
                <th className="py-2 text-start font-normal">{s.guideBed}</th>
                <th className="py-2 text-start font-normal">
                  {p.kind === "duvet" ? s.guideDuvet : s.guideBedspread}
                </th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((b) => (
                <tr key={b.id} className="border-b border-border/60">
                  <td className="py-2">{b[lang]}</td>
                  <td className="py-2">
                    <bdi dir="ltr">{b.bed}</bdi>
                  </td>
                  <td className="py-2">
                    <bdi dir="ltr">{dims[b.id]}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">{s.guideNote}</p>
        </details>
      )}
    </div>
  );
}
