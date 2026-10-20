import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("probe", () => {
  it("renders where?", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({ initialEntries: ["/produit/sultan-velvet"] }),
    });
    const { container } = render(<RouterProvider router={router} />);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("CONTAINER_LEN>>>", (container.textContent ?? "").length);
    console.log("BODY_LEN>>>", (document.body.textContent ?? "").length);
    console.log("BODY_HAS_DIMS>>>", (document.body.textContent ?? "").includes("220 × 240 cm"));
    console.log("BODY_HAS_TITLE>>>", (document.body.textContent ?? "").includes("Sultan Velvet"));
    expect(true).toBe(true);
  });
});
