import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { colorById, products } from "@/lib/products";

export const MAX_QTY = 20;

export type CartItem = { slug: string; qty: number; color?: string | undefined; size?: string | undefined };
type Checkout = { items: CartItem[]; fromCart: boolean } | null;

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  checkout: Checkout;
  startCheckout: (items: CartItem[], fromCart: boolean) => void;
  closeCheckout: () => void;
};

const KEY = "noauma-cart";
const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n)));
// Same product in two colors or sizes is two cart lines.
export const itemKey = (i: { slug: string; color?: string | undefined; size?: string | undefined }) =>
  `${i.slug}|${i.color ?? ""}|${i.size ?? ""}`;

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    // Drop anything stale or tampered with: unknown products, bad quantities.
    return raw.flatMap((i: Partial<CartItem>) => {
      if (typeof i?.slug !== "string" || typeof i.qty !== "number") return [];
      const p = products.find((p) => p.slug === i.slug);
      if (!p) return [];
      const color =
        typeof i.color === "string" && p.colors?.some((c) => c.id === i.color)
          ? i.color
          : undefined;
      const size =
        typeof i.size === "string" && p.sizes?.includes(i.size) ? i.size : undefined;
      return [{ slug: i.slug, qty: clamp(i.qty), color, size }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkout, setCheckout] = useState<Checkout>(null);
  const loaded = useRef(false);

  // Restore after mount so the server render (empty cart) matches the first client render.
  useEffect(() => {
    setItems(load());
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Ignore: the cart just won't survive a reload.
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add: (item) =>
        setItems((cur) => {
          const k = itemKey(item);
          return cur.some((i) => itemKey(i) === k)
            ? cur.map((i) => (itemKey(i) === k ? { ...i, qty: clamp(i.qty + item.qty) } : i))
            : [...cur, { ...item, qty: clamp(item.qty) }];
        }),
      setQty: (key, qty) =>
        setItems((cur) => cur.map((i) => (itemKey(i) === key ? { ...i, qty: clamp(qty) } : i))),
      remove: (key) => setItems((cur) => cur.filter((i) => itemKey(i) !== key)),
      clear: () => setItems([]),
      drawerOpen,
      setDrawerOpen,
      checkout,
      startCheckout: (items, fromCart) => setCheckout({ items, fromCart }),
      closeCheckout: () => setCheckout(null),
    }),
    [items, drawerOpen, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}

export { colorById };
