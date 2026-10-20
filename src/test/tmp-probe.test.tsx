import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

async function probe(path: string) {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  let err = "none";
  try {
    await router.load();
  } catch (e) {
    err = String(e).slice(0, 120);
  }
  const { container } = render(<RouterProvider router={router} />);
  await new Promise((r) => setTimeout(r, 900));
  console.log(
    `PROBE ${path}>>> loadErr=${err} container=${(container.textContent ?? "").length} body=${(document.body.textContent ?? "").length} firstChild=${container.firstChild ? "yes" : "null"}`,
  );
}

describe("probe", () => {
  it("checks each path", async () => {
    await probe("/");
    await probe("/this-route-does-not-exist");
    await probe("/produit/sultan-velvet");
    expect(true).toBe(true);
  });
});
