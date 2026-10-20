import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Clock, RefreshCw, ShoppingBag, Truck, Zap } from "lucide-react";
import { QtyStepper, ShopHeader } from "@/components/shop";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { products, productBySlug, SITE_URL, type Product } from "@/lib/products";
import { shopText } from "@/lib/shop-text";

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
  const [colorId, setColorId] = useState(p.colors?.[0]?.id);
  const [imgIdx, setImgIdx] = useState(0);
  const [name, desc] = p[lang];

  const color = p.colors?.find((c) => c.id === colorId) ?? p.colors?.[0];
  const gallery = color?.imgs ?? [p.img];
  const shown = gallery[Math.min(imgIdx, gallery.length - 1)]!;

  const i = products.indexOf(p);
  const related = [1, 2, 3].map((k) => products[(i + k) % products.length]!);

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div>
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img
              src={shown}
              alt={color ? `${name} — ${color[lang]}` : name}
              width={800}
              height={1000}
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {gallery.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImgIdx(idx)}
                  aria-label={`${name} — photo ${idx + 1}`}
                  className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                    idx === imgIdx ? "border-rose-deep" : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    width={200}
                    height={250}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">NOAUMA · Kenitra</p>
          <h1 className="mt-3 text-5xl text-ink md:text-6xl">{name}</h1>
          <p className="mt-4 font-serif text-3xl text-rose-deep">
            {p.price} {s.mad}
          </p>
          <p className="mt-4 text-muted-foreground">{desc}</p>

          {p.colors && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.colorLabel} : <span className="text-ink">{color?.[lang]}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {p.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setColorId(c.id);
                      setImgIdx(0);
                    }}
                    aria-label={c[lang]}
                    title={c[lang]}
                    className={`h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                      c.id === color?.id
                        ? "scale-110 border-rose-deep shadow-soft"
                        : "border-gold/30 hover:border-rose-deep/60"
                    }`}
                  >
                    <img src={c.imgs[0]} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.dims && (
            <div className="mt-6 rounded-2xl border border-gold/25 bg-cream/60 px-5 py-4">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">
                {s.dimensions}
              </p>
              <p className="mt-1.5 font-serif text-lg leading-snug text-ink">{p.dims[lang]}</p>
            </div>
          )}

          <div className="mt-8">
            <QtyStepper value={qty} onChange={setQty} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                add({ slug: p.slug, qty, color: color?.id });
                setDrawerOpen(true);
              }}
              className="btn-ghost !py-4 text-rose-deep"
            >
              <ShoppingBag className="h-4 w-4" /> {s.addToCart}
            </button>
            <button
              type="button"
              onClick={() =>
                startCheckout([{ slug: p.slug, qty, color: color?.id }], false)
              }
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
              <Clock className="h-4 w-4 text-gold" /> {s.deliveryTime}
            </li>
            <li className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-gold" /> {s.checkParcel}
            </li>
            <li className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-gold" /> {s.exchange}
            </li>
          </ul>
          <Link
            to="/aide"
            className="mt-4 w-fit text-xs uppercase tracking-[0.15em] text-rose-deep underline-offset-4 hover:underline"
          >
            {s.helpLink}
          </Link>
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
                  {r.price} {s.mad}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
