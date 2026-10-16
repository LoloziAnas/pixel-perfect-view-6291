import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Banknote, Home, MapPin, Minus, Phone, Plus, ShoppingBag, Truck, User, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { products, wa, orderMessage, type Product } from "@/lib/products";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData }) => {
    const p = products.find((x) => x.slug === loaderData?.slug);
    const title = p ? `${p.fr[0]} — NOAUMA` : "Produit — NOAUMA";
    const desc = p ? `${p.fr[1]} ${p.price} MAD, livraison gratuite partout au Maroc.` : "Linge de lit premium NOAUMA.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  errorComponent: () => <Missing />,
  notFoundComponent: () => <Missing />,
});

function Missing() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <h1 className="text-4xl text-ink">Produit introuvable</h1>
        <Link to="/" className="btn-primary mt-6">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Veuillez saisir votre nom").max(100),
  phone: z.string().trim().regex(/^(\+?212|0)[5-7]\d{8}$/, "Numéro marocain invalide (ex : 06 12 34 56 78)"),
  address: z.string().trim().min(5, "Adresse complète obligatoire").max(300),
  city: z.string().trim().min(2, "Veuillez saisir votre ville").max(80),
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = products.find((x) => x.slug === slug) as Product;
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-ink py-2 text-center text-[0.65rem] uppercase tracking-[0.2em] text-cream">
        Livraison gratuite partout au Maroc · Paiement à la livraison
      </div>
      <header className="border-b border-gold/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
          <Link to="/"><img src={logo} alt="Logo NOAUMA" width={64} height={64} className="h-16 w-16" /></Link>
          <span className="w-20" />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img src={p.img} alt={p.fr[0]} width={800} height={1000} className="aspect-[4/5] h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">NOAUMA · Kenitra</p>
          <h1 className="mt-3 text-5xl text-ink md:text-6xl">{p.fr[0]}</h1>
          <p className="mt-4 font-serif text-3xl text-rose-deep">{p.price} MAD</p>
          <p className="mt-4 text-muted-foreground">{p.fr[1]}</p>

          <div className="mt-8 inline-flex w-fit items-center rounded-full border border-gold/40">
            <button aria-label="Diminuer" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
            <span className="w-10 text-center">{qty}</span>
            <button aria-label="Augmenter" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid h-11 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
          </div>

          <button onClick={() => setOpen(true)} className="btn-primary mt-6 w-full !py-4">
            <ShoppingBag className="h-4 w-4" /> Acheter maintenant
          </button>

          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-gold" /> Livraison gratuite partout au Maroc</li>
            <li className="flex items-center gap-3"><Banknote className="h-4 w-4 text-gold" /> Paiement à la livraison</li>
          </ul>
        </div>
      </main>

      {open && <OrderModal product={p} qty={qty} onClose={() => setOpen(false)} />}
    </div>
  );
}

function OrderModal({ product, qty, onClose }: { product: Product; qty: number; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const total = product.price * qty;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ ...form, phone: form.phone.replace(/[\s.-]/g, "") });
    if (!r.success) {
      const errs: typeof errors = {};
      for (const i of r.error.issues) errs[i.path[0] as keyof typeof form] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    window.open(wa(orderMessage(product, qty, r.data)), "_blank", "noopener,noreferrer");
  };

  const fields: { key: keyof typeof form; ph: string; icon: typeof User; type?: string }[] = [
    { key: "name", ph: "Nom & Prénom", icon: User },
    { key: "phone", ph: "Téléphone", icon: Phone, type: "tel" },
    { key: "address", ph: "Adresse complète obligatoire", icon: Home },
    { key: "city", ph: "Ville", icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-soft" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="order-title" className="text-2xl text-ink">Insérer vos coordonnées</h2>
          <button type="button" onClick={onClose} aria-label="Fermer"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          {fields.map(({ key, ph, icon: Icon, type }) => (
            <div key={key}>
              <label className="flex overflow-hidden rounded-lg border border-input focus-within:border-gold">
                <span className="grid w-11 place-items-center bg-cream text-ink"><Icon className="h-4 w-4" /></span>
                <input
                  type={type ?? "text"}
                  placeholder={ph}
                  aria-label={ph}
                  value={form[key]}
                  maxLength={300}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                />
              </label>
              {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 border-y border-border py-4">
          <div className="relative">
            <img src={product.img} alt="" width={56} height={56} className="h-14 w-14 rounded-md object-cover" />
            <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.65rem] text-cream">{qty}</span>
          </div>
          <span className="flex-1 text-sm font-medium text-ink">{product.fr[0]}</span>
          <span className="text-sm font-medium">{total} dh</span>
        </div>

        <div className="mt-4 space-y-2 rounded-lg bg-cream p-4 text-sm">
          <div className="flex justify-between"><span>Sous-total</span><span>{total} dh</span></div>
          <div className="flex justify-between"><span>Livraison</span><span className="font-medium">Gratuit</span></div>
          <div className="flex justify-between border-t border-border pt-2 font-medium text-ink"><span>Total</span><span className="font-serif text-xl">{total} dh</span></div>
        </div>

        <button type="submit" className="btn-primary mt-5 w-full !py-4">Acheter maintenant</button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Votre commande sera envoyée sur WhatsApp pour confirmation.</p>
      </form>
    </div>
  );
}
