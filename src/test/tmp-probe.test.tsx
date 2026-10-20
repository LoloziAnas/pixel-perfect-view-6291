import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("probe", () => {
  it("renders with router.load()", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({ initialEntries: ["/produit/sultan-velvet"] }),
    });
    try {
      await router.load();
      console.log("LOADED>>>", router.state.isLoading, router.state.matches.length);
    } catch (e) {
      console.log("LOAD_ERR>>>", String(e).slice(0, 200));
    }
    const { container } = render(<RouterProvider router={router} />);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("CONTAINER_LEN>>>", (container.textContent ?? "").length);
    console.log("BODY_HAS_DIMS>>>", (document.body.textContent ?? "").includes("220 × 240 cm"));
    expect(true).toBe(true);
  });
});
