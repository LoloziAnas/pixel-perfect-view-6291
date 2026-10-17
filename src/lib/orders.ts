import { createServerFn } from "@tanstack/react-start";
import { orderInputSchema } from "@/lib/order-schema";
import { orderMessage, orderTotal, productBySlug, type OrderLine } from "@/lib/products";

// Order numbers like NOA-261017-K7Q2: date + 4 random characters (no 0/O/1/I to avoid misreading).
function newOrderId(now: Date) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = crypto.getRandomValues(new Uint32Array(4));
  const suffix = Array.from(rand, (n) => alphabet[n % alphabet.length]).join("");
  const date = now.toISOString().slice(2, 10).replaceAll("-", "");
  return `NOA-${date}-${suffix}`;
}

// Sends the order to the Google Apps Script web app (see scripts/orders-google-sheet.gs),
// which appends it to the orders Sheet and emails the shop.
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator(orderInputSchema)
  .handler(async ({ data }) => {
    const now = new Date();
    const id = newOrderId(now);

    // Bots fill the hidden field or submit instantly: pretend success, send nothing.
    if (data.website || data.elapsedMs < 1500) return { id };

    // Prices always come from the server-side catalogue, never from the browser.
    const lines: OrderLine[] = data.items.map((i) => {
      const product = productBySlug(i.slug);
      if (!product) throw new Error(`Unknown product: ${i.slug}`);
      return { product, qty: i.qty };
    });

    const url = process.env["ORDERS_WEBHOOK_URL"];
    const secret = process.env["ORDERS_WEBHOOK_SECRET"];
    if (!url || !secret) throw new Error("ORDERS_WEBHOOK_URL / ORDERS_WEBHOOK_SECRET not set");

    const c = data.customer;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret,
        id,
        createdAt: now.toISOString(),
        lang: data.lang,
        name: c.name,
        phone: c.phone,
        address: c.address,
        city: c.city,
        notes: c.notes,
        itemsText: lines.map((l) => `${l.product.fr[0]} × ${l.qty}`).join("\n"),
        total: orderTotal(lines),
        message: orderMessage(lines, c, id),
      }),
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !body?.ok) {
      throw new Error(`Order webhook failed: HTTP ${res.status} ${body?.error ?? ""}`.trim());
    }
    return { id };
  });
