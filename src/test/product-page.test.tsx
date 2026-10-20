import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
});

// The Sultan Velvet set is sold in one fixed size: the page states the dimensions
// instead of offering a size picker (customer-stated rule).
describe("Sultan Velvet product page", () => {
  it("shows the dimensions of the set", async () => {
    const { container } = renderAt("/produit/sultan-velvet");

    await waitFor(() => expect(container.textContent).toContain("Sultan Velvet"));
    expect(container.textContent).toContain("220 × 240 cm");
    expect(container.textContent).toContain("50 × 75 cm");
  });

  it("offers no size buttons", async () => {
    const { container } = renderAt("/produit/sultan-velvet");

    await waitFor(() => expect(container.textContent).toContain("Sultan Velvet"));
    expect(container.textContent).not.toContain("2m ×");
  });
});
