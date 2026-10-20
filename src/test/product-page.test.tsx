import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { orderMessage, productBySlug, type OrderInfo, type OrderLine } from "@/lib/products";

async function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
});

const info: OrderInfo = {
  name: "Test Noauma",
  phone: "0612345678",
  address: "1 rue des Lilas",
  city: "Kénitra",
};

// The Sultan Velvet set is sold in one fixed size: the page states the dimensions
// instead of offering a size picker, and the order carries those dimensions.
describe("Sultan Velvet dimensions", () => {
  it("shows the dimensions and no size picker", async () => {
    const { container } = await renderAt("/produit/sultan-velvet");

    await waitFor(() => expect(container.textContent).toContain("Sultan Velvet"));
    expect(container.textContent).toContain("220 × 240 cm");
    expect(container.textContent).toContain("50 × 75 cm");
    expect(container.textContent).not.toContain("2m ×");
  });

  it("sends the dimensions with the order message", () => {
    const p = productBySlug("sultan-velvet")!;
    const lines: OrderLine[] = [{ slug: p.slug, product: p, qty: 2, color: "Bleu clair" }];

    const msg = orderMessage(lines, info, "NOA-TEST");

    expect(msg).toContain("Sultan Velvet (Bleu clair) × 2 — 740 MAD");
    expect(msg).toContain("220 × 240 cm + 2 taies 50 × 75 cm");
  });
});
