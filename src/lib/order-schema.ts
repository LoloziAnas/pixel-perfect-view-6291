import { z } from "zod";
import { MAX_QTY } from "@/lib/cart";
import { shopText, type ShopText } from "@/lib/shop-text";

// Shared by the checkout form (localized messages) and the server (re-validates everything).
export const makeCustomerSchema = (s: ShopText) =>
  z.object({
    name: z.string().trim().min(2, s.errName).max(100),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s.-]/g, ""))
      .pipe(z.string().regex(/^(\+?212|0)[5-7]\d{8}$/, s.errPhone)),
    address: z.string().trim().min(5, s.errAddress).max(300),
    city: z.string().trim().min(2, s.errCity).max(80),
    notes: z.string().trim().max(300),
  });

export const orderInputSchema = z.object({
  items: z
    .array(z.object({ slug: z.string().max(80), qty: z.number().int().min(1).max(MAX_QTY) }))
    .min(1)
    .max(30),
  customer: makeCustomerSchema(shopText.fr),
  lang: z.enum(["fr", "ar"]),
  // Anti-spam: a field humans never see, and how long the form was open.
  website: z.string().max(200),
  elapsedMs: z.number().min(0),
});

export type OrderInput = z.input<typeof orderInputSchema>;
