import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("debug", () => {
  it("prints product page output", async () => {
    const spy = vi_spy();
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({ initialEntries: ["/produit/sultan-velvet"] }),
    });
    const { container } = render(<RouterProvider router={router} />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
    await new Promise((r) => setTimeout(r, 1500));
    console.log("TEXT>>>" + (container.textContent ?? "").slice(0, 400) + "<<<");
    console.log("HTML>>>" + container.innerHTML.slice(0, 400) + "<<<");
    console.log("ERRORS>>>", spy);
    expect(true).toBe(true);
  });
});
function vi_spy() { return []; }
