import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";

export const MAX_QTY = 20;

export type CartItem = { slug: string; qty: number };
type Checkout = { items: CartItem[]; fromCart: boolean } | null;

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (slug: string, qty: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  checkout: Checkout;
  startCheckout: (items: CartItem[], fromCart: boolean) => void;
  closeCheckout: () => void;
};

const KEY = "noauma-cart";
const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n)));

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    // Drop anything stale or tampered with: unknown products, bad quantities.
    return raw.flatMap((i: Partial<CartItem>) =>
      typeof i?.slug === "string" &&
      typeof i.qty === "number" &&
      products.some((p) => p.slug === i.slug)
        ? [{ slug: i.slug, qty: clamp(i.qty) }]
        : [],
    );
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
      add: (slug, qty) =>
        setItems((cur) =>
          cur.some((i) => i.slug === slug)
            ? cur.map((i) => (i.slug === slug ? { ...i, qty: clamp(i.qty + qty) } : i))
            : [...cur, { slug, qty: clamp(qty) }],
        ),
      setQty: (slug, qty) =>
        setItems((cur) => cur.map((i) => (i.slug === slug ? { ...i, qty: clamp(qty) } : i))),
      remove: (slug) => setItems((cur) => cur.filter((i) => i.slug !== slug)),
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
