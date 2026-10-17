import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { z } from "zod";
import {
  CircleCheck,
  Home,
  MapPin,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { MAX_QTY, useCart, type CartItem } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { orderMessage, orderTotal, productBySlug, wa, type OrderLine } from "@/lib/products";
import { shopText, type ShopText } from "@/lib/shop-text";

function useText() {
  const [lang] = useLang();
  return { lang, s: shopText[lang] };
}

const toLines = (items: CartItem[]): OrderLine[] =>
  items.flatMap((i) => {
    const product = productBySlug(i.slug);
    return product ? [{ product, qty: i.qty }] : [];
  });

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
                {lines.map(({ product, qty }) => (
                  <li key={product.slug} className="flex gap-4 py-4">
                    <img
                      src={product.img}
                      alt=""
                      width={72}
                      height={90}
                      className="h-[90px] w-[72px] shrink-0 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-lg leading-tight text-ink">
                          {product[lang][0]}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(product.slug)}
                          aria-label={`${s.remove} ${product[lang][0]}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QtyStepper small value={qty} onChange={(n) => setQty(product.slug, n)} />
                        <span className="text-sm font-medium">
                          {product.price * qty} {s.mad}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
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
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-card p-6 shadow-soft outline-none"
        >
          {checkout && <OrderForm items={checkout.items} fromCart={checkout.fromCart} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

type FormKey = "name" | "phone" | "address" | "city" | "notes";

const makeSchema = (s: ShopText) =>
  z.object({
    name: z.string().trim().min(2, s.errName).max(100),
    phone: z
      .string()
      .trim()
      .regex(/^(\+?212|0)[5-7]\d{8}$/, s.errPhone),
    address: z.string().trim().min(5, s.errAddress).max(300),
    city: z.string().trim().min(2, s.errCity).max(80),
    notes: z.string().trim().max(300),
  });

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
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const lines = toLines(items);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = makeSchema(s).safeParse({ ...form, phone: form.phone.replace(/[\s.-]/g, "") });
    if (!r.success) {
      const errs: typeof errors = {};
      for (const i of r.error.issues) errs[i.path[0] as FormKey] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const url = wa(orderMessage(lines, r.data));
    setSentUrl(url);
    if (fromCart) clear();
    // May be blocked as a popup; the confirmation screen keeps a direct link either way.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (sentUrl) {
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto h-12 w-12 text-gold" strokeWidth={1.25} />
        <DialogPrimitive.Title className="mt-4 text-2xl text-ink">{s.thanks}</DialogPrimitive.Title>
        <p className="mt-3 text-sm text-muted-foreground">{s.thanksText}</p>
        <a
          href={sentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 w-full !py-4"
        >
          {s.openWa}
        </a>
        <DialogPrimitive.Close className="mt-4 text-xs uppercase tracking-widest text-muted-foreground hover:text-ink">
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
    { key: "notes", ph: s.notes, icon: MessageSquare, autoComplete: "off" },
  ];

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-5 flex items-center justify-between">
        <DialogPrimitive.Title className="text-2xl text-ink">{s.formTitle}</DialogPrimitive.Title>
        <DialogPrimitive.Close aria-label={s.close}>
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
      </div>

      <div className="space-y-3">
        {fields.map(({ key, ph, icon: Icon, type, autoComplete }) => (
          <div key={key}>
            <label className="flex overflow-hidden rounded-lg border border-input focus-within:border-gold">
              <span className="grid w-11 shrink-0 place-items-center bg-cream text-ink">
                <Icon className="h-4 w-4" />
              </span>
              <input
                type={type ?? "text"}
                name={key}
                dir={type === "tel" ? "ltr" : undefined}
                autoComplete={autoComplete}
                placeholder={ph}
                aria-label={ph}
                value={form[key]}
                maxLength={300}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none rtl:text-right"
              />
            </label>
            {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <ul className="mt-5 divide-y divide-border border-y border-border">
        {lines.map(({ product, qty }) => (
          <li key={product.slug} className="flex items-center gap-3 py-3">
            <div className="relative shrink-0">
              <img
                src={product.img}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-md object-cover"
              />
              <span className="absolute -end-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.65rem] text-cream">
                {qty}
              </span>
            </div>
            <span className="flex-1 text-sm font-medium text-ink">{product[lang][0]}</span>
            <span className="text-sm font-medium">
              {product.price * qty} {s.mad}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Totals total={orderTotal(lines)} s={s} />
      </div>

      <button type="submit" className="btn-primary mt-5 w-full !py-4">
        {s.submit}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">{s.sendNote}</p>
    </form>
  );
}
