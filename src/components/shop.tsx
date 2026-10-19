import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Lock,
  ShieldCheck,
  Truck,
  Home,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import logo from "@/assets/logo.webp";
import { itemKey, MAX_QTY, useCart, type CartItem } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { makeCustomerSchema } from "@/lib/order-schema";
import { placeOrder } from "@/lib/orders";
import { orderTotal, productBySlug, type OrderLine } from "@/lib/products";
import { shopText, type ShopText } from "@/lib/shop-text";

function useText() {
  const [lang] = useLang();
  return { lang, s: shopText[lang] };
}

const toLines = (items: CartItem[]): OrderLine[] =>
  items.flatMap((i) => {
    const product = productBySlug(i.slug);
    return product ? [{ product, qty: i.qty, color: i.color, size: i.size }] : [];
  });

// Localized color/size summary for a cart or checkout line, e.g. "Rose pêche · 2m × 1,40m".
function variantText(line: OrderLine, lang: "fr" | "ar") {
  const color = line.product.colors?.find((c) => c.id === line.color);
  return [color?.[lang], line.size].filter(Boolean).join(" · ");
}

export function QtyStepper({
  value,
  onChange,
  small = false,
}: {
  value: number;
  onChange: (qty: number) => void;
  small?: boolean;
}) {
  const { s } = useText();
  const btn = small ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className="inline-flex w-fit items-center rounded-full border border-gold/40">
      <button
        type="button"
        aria-label={s.decrease}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className={`grid ${btn} place-items-center disabled:opacity-35`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={`${small ? "w-6 text-sm" : "w-10"} text-center`}>{value}</span>
      <button
        type="button"
        aria-label={s.increase}
        disabled={value >= MAX_QTY}
        onClick={() => onChange(value + 1)}
        className={`grid ${btn} place-items-center disabled:opacity-35`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ShopHeader() {
  const { s } = useText();
  return (
    <>
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
    </>
  );
}

export function LangToggle() {
  const [lang, setLang] = useLang();
  const { s } = useText();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
      className="rounded-full border border-gold/50 px-3 py-1.5 text-[0.62rem] tracking-widest text-ink transition-colors hover:bg-cream"
      aria-label={s.switchLangLabel}
    >
      {s.switchLang}
    </button>
  );
}

export function CartButton() {
  const { count, setDrawerOpen } = useCart();
  const { s } = useText();
  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      aria-label={s.cartLabel(count)}
      className="relative grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-cream"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-deep px-1 text-[0.6rem] leading-none text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

function Totals({ total, s }: { total: number; s: ShopText }) {
  return (
    <div className="space-y-2 rounded-lg bg-cream p-4 text-sm">
      <div className="flex justify-between">
        <span>{s.subtotal}</span>
        <span>
          {total} {s.mad}
        </span>
      </div>
      <div className="flex justify-between">
        <span>{s.delivery}</span>
        <span className="font-medium">{s.free}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2 font-medium text-ink">
        <span>{s.total}</span>
        <span className="font-serif text-xl">
          {total} {s.mad}
        </span>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, setQty, remove, drawerOpen, setDrawerOpen, startCheckout } = useCart();
  const { lang, s } = useText();
  const lines = toLines(items);

  return (
    <DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-soft outline-none"
        >
          <div className="flex items-center justify-between border-b border-gold/15 px-5 py-4">
            <DialogPrimitive.Title className="text-2xl text-ink">{s.cart}</DialogPrimitive.Title>
            <DialogPrimitive.Close aria-label={s.close}>
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
              <ShoppingBag className="h-10 w-10 text-gold" strokeWidth={1} />
              <p className="text-muted-foreground">{s.emptyCart}</p>
              <DialogPrimitive.Close className="btn-primary">
                {s.continueShopping}
              </DialogPrimitive.Close>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
                {lines.map((line) => {
                  const { product, qty } = line;
                  const key = itemKey(line);
                  const variant = variantText(line, lang);
                  return (
                  <li key={key} className="flex gap-4 py-4">
                    <img
                      src={product.colors?.find((c) => c.id === line.color)?.imgs[0] ?? product.img}
                      alt=""
                      width={72}
                      height={90}
                      className="h-[90px] w-[72px] shrink-0 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-lg leading-tight text-ink">
                          {product[lang][0]}
                          {variant && (
                            <span className="block text-xs font-normal text-muted-foreground">
                              {variant}
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          aria-label={`${s.remove} ${product[lang][0]}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QtyStepper small value={qty} onChange={(n) => setQty(key, n)} />
                        <span className="text-sm font-medium">
                          {product.price * qty} {s.mad}
                        </span>
                      </div>
                    </div>
                  </li>
                  );
                })}
              </ul>
              <div className="border-t border-gold/15 p-5">
                <Totals total={orderTotal(lines)} s={s} />
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    startCheckout(items, true);
                  }}
                  className="btn-primary mt-4 w-full !py-4"
                >
                  {s.checkout}
                </button>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Radix handles Escape, focus trap and scroll lock; the form unmounts (and resets) on close.
export function CheckoutDialog() {
  const { checkout, closeCheckout } = useCart();
  const { lang } = useText();

  return (
    <DialogPrimitive.Root open={checkout !== null} onOpenChange={(o) => !o && closeCheckout()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="checkout-card fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-gold/20 bg-card p-6 sm:p-8 shadow-soft outline-none"
        >
          {checkout && <OrderForm items={checkout.items} fromCart={checkout.fromCart} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

type FormKey = "name" | "phone" | "address" | "city" | "notes";

function OrderForm({ items, fromCart }: { items: CartItem[]; fromCart: boolean }) {
  const { clear } = useCart();
  const { lang, s } = useText();
  const [form, setForm] = useState<Record<FormKey, string>>({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const openedAt = useRef(Date.now());
  const lines = toLines(items);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const r = makeCustomerSchema(s).safeParse(form);
    if (!r.success) {
      const errs: typeof errors = {};
      for (const i of r.error.issues) errs[i.path[0] as FormKey] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const { id } = await placeOrder({
        data: {
          items: items.map(({ slug, qty }) => ({ slug, qty })),
          customer: r.data,
          lang,
          website: honeypot,
          elapsedMs: Date.now() - openedAt.current,
        },
      });
      if (fromCart) clear();
      setOrderId(id);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (orderId) {
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto h-12 w-12 text-gold" strokeWidth={1.25} />
        <DialogPrimitive.Title className="mt-4 text-2xl text-ink">{s.thanks}</DialogPrimitive.Title>
        <p className="mt-3 text-sm text-muted-foreground">{s.thanksText}</p>
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {s.orderNumber}
        </p>
        <p className="mt-1 font-serif text-2xl text-rose-deep" dir="ltr">
          {orderId}
        </p>
        <DialogPrimitive.Close className="btn-primary mt-6 w-full !py-4">
          {s.close}
        </DialogPrimitive.Close>
      </div>
    );
  }

  const fields: {
    key: FormKey;
    ph: string;
    icon: typeof User;
    type?: string;
    autoComplete: string;
  }[] = [
    { key: "name", ph: s.name, icon: User, autoComplete: "name" },
    { key: "phone", ph: s.phone, icon: Phone, type: "tel", autoComplete: "tel" },
    { key: "address", ph: s.address, icon: Home, autoComplete: "street-address" },
    { key: "city", ph: s.city, icon: MapPin, autoComplete: "address-level2" },
  ];

  const total = orderTotal(lines);
  return (
    <form onSubmit={submit} noValidate className="relative">
      <DialogPrimitive.Close
        aria-label={s.close}
        className="absolute -end-1 -top-1 text-ink/70 hover:text-ink"
      >
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>

      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="Logo NOAUMA" width={112} height={112} className="h-28 w-28" />
        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-gold">{s.tagline}</p>
        <div className="mt-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-gold/40" />
          <DialogPrimitive.Title className="text-3xl uppercase tracking-[0.12em] text-rose-deep">
            {s.formTitle}
          </DialogPrimitive.Title>
          <span className="h-px flex-1 bg-gold/40" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{s.formSub}</p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-rose/20 text-rose-deep">
          <User className="h-4 w-4" />
        </span>
        <h3 className="font-serif text-xl text-ink">{s.yourInfo}</h3>
      </div>

      <div className="mt-3 space-y-3">
        {fields.map(({ key, ph, icon: Icon, type, autoComplete }) => (
          <div key={key}>
            <label
              className={`flex items-center gap-1 rounded-xl border bg-background px-2 transition-colors focus-within:border-rose-deep ${errors[key] ? "border-destructive" : "border-gold/30"}`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-rose-deep">
                <Icon className="h-4 w-4" />
              </span>
              <input
                type={type ?? "text"}
                name={key}
                dir={type === "tel" ? "ltr" : undefined}
                autoComplete={autoComplete}
                placeholder={key === "notes" ? ph : `${ph} *`}
                aria-label={ph}
                value={form[key]}
                maxLength={300}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none rtl:text-right"
              />
            </label>
            {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gold/20 bg-background p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rose/20 text-rose-deep">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <h3 className="font-serif text-xl text-ink">{s.yourOrder}</h3>
        </div>
        <ul className="mt-3 divide-y divide-border">
          {lines.map(({ product, qty }) => (
            <li key={product.slug} className="flex items-center gap-3 py-3">
              <img
                src={product.img}
                alt=""
                width={80}
                height={80}
                className="h-24 w-28 shrink-0 rounded-lg object-cover shadow-soft"
              />
              <div className="flex-1">
                <p className="font-serif text-xl leading-tight text-rose-deep">
                  {product[lang][0]}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{product[lang][1]}</p>
                <span className="mt-2 inline-block rounded-md bg-rose/20 px-2.5 py-1 text-[0.7rem] text-rose-deep">
                  {s.qtyLabel} : {qty}
                </span>
              </div>
              <span className="font-serif text-2xl text-ink">
                {product.price * qty} {s.mad}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <span>{s.subtotal}</span>
            <span>
              {total} {s.mad}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{s.delivery}</span>
            <span className="font-medium text-rose-deep">{s.free}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-rose/15 px-4 py-3 font-serif text-ink">
          <span className="text-xl">{s.total}</span>
          <span className="text-2xl text-rose-deep">
            {total} {s.mad}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-gold/30 rounded-xl bg-cream/50 py-3 text-[0.62rem] leading-snug text-muted-foreground rtl:divide-x-reverse">
        {(
          [
            [Truck, s.trustShip, s.trustShipSub],
            [ShieldCheck, s.trustPay, s.trustPaySub],
            [Lock, s.trustSafe, s.trustSafeSub],
          ] as const
        ).map(([Ic, label, sub]) => (
          <div
            key={label}
            className="flex items-center gap-2 px-2 max-sm:flex-col max-sm:text-center"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose/15 text-rose-deep">
              <Ic className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-ink/80">{label}</span>
              {sub}
            </span>
          </div>
        ))}
      </div>

      {/* Hidden from people; bots that fill every field give themselves away. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {s.sendError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-deep py-4 font-serif text-base uppercase tracking-[0.12em] text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:opacity-95 disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "sending" ? (
          s.sending
        ) : (
          <>
            {s.submit} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">{s.sendNote}</p>
      <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
        <span className="h-px w-24 bg-gold/50" />
        <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
        <span className="h-px w-24 bg-gold/50" />
      </div>
    </form>
  );
}
