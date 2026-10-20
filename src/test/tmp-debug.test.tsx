import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("debug", () => {
  it("prints product page output", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({ initialEntries: ["/produit/sultan-velvet"] }),
    });
    const { container } = render(<RouterProvider router={router} />);
    await waitFor(() => expect(container.textContent).toContain("Sultan Velvet"), { timeout: 8000 });
    console.log("TEXT>>>" + (container.textContent ?? "").slice(0, 300) + "<<<");
    console.log("WARNS>>>", warn.mock.calls.length);
    expect(true).toBe(true);
  });
});
