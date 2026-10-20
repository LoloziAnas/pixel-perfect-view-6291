import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { products } from "@/lib/products";

const root = join(__dirname, "../..");
const dir = join(root, "src/content/products");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
// Products switched off ("En vente") are left out of the shop on purpose.
const published = files.filter(
  (f) =>
    (JSON.parse(readFileSync(join(dir, f), "utf8")) as { published?: boolean }).published !== false,
);

// Product files are written by the admin page; catch a broken one before it ships.
describe("product catalogue", () => {
  // A file that fails validation is silently dropped from the shop, so it shows up missing here.
  it("loads every published product file", () => {
    expect(published.length).toBeGreaterThan(0);
    expect(products.map((p) => p.slug).sort()).toEqual(
      published.map((f) => f.replace(/\.json$/, "")).sort(),
    );
  });

  it("points at photos that exist", () => {
    for (const p of products) {
      const photos = [p.img, ...(p.colors?.flatMap((c) => c.imgs) ?? [])];
      for (const src of photos) expect(existsSync(join(root, "public", src)), src).toBe(true);
    }
  });

  it("keeps the color ids used by carts and orders", () => {
    expect(products.find((p) => p.slug === "sultan-velvet")?.colors?.map((c) => c.id)).toEqual([
      "rose-peche",
      "creme-elegant",
      "bleu-clair",
      "rose-poudre",
    ]);
  });
});
