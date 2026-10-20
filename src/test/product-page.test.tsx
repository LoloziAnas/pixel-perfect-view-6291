import { describe, expect, it } from "vitest";
import { orderMessage, productBySlug, type OrderInfo, type OrderLine } from "@/lib/products";

const info: OrderInfo = {
  name: "Test Noauma",
  phone: "0612345678",
  address: "1 rue des Lilas",
  city: "Kénitra",
};

// The Sultan Velvet set is sold in one fixed size: the dimensions are printed on the
// product page and travel with the order instead of a size choice (customer-stated rule).
describe("Sultan Velvet dimensions", () => {
  it("states the dimensions in both languages and offers no size choice", () => {
    const p = productBySlug("sultan-velvet");

    expect(p?.dims?.fr).toBe("220 × 240 cm + 2 taies 50 × 75 cm");
    expect(p?.dims?.ar).toBe("220 × 240 سم + 2 أكياس وسائد 50 × 75 سم");
    expect(p).not.toHaveProperty("sizes");
  });

  it("sends the dimensions with the order message", () => {
    const p = productBySlug("sultan-velvet")!;
    const lines: OrderLine[] = [{ slug: p.slug, product: p, qty: 2, color: "Bleu clair" }];

    const msg = orderMessage(lines, info, "NOA-TEST");

    expect(msg).toContain("Sultan Velvet (Bleu clair) × 2 — 740 MAD");
    expect(msg).toContain("220 × 240 cm + 2 taies 50 × 75 cm");
  });
});
