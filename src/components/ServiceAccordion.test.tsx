import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { ServiceAccordion } from "./ServiceAccordion";
import { SERVICES } from "@/lib/clinic";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

/** Renders the cards inside a minimal router, so their links resolve to the category pages. */
async function renderCards() {
  const root = createRootRoute({ component: () => <Outlet /> });
  const home = createRoute({ getParentRoute: () => root, path: "/", component: () => <ServiceAccordion /> });
  const page = createRoute({ getParentRoute: () => root, path: "/services/$id", component: () => <p>service page</p> });
  const router = createRouter({ routeTree: root.addChildren([home, page]), history: createMemoryHistory({ initialEntries: ["/"] }) });
  render(<RouterProvider router={router} />);
  await screen.findByText(SERVICES[0]!.title);
  return router;
}

describe("Service cards", () => {
  it("shows every category as a link to its own page", async () => {
    await renderCards();
    for (const service of SERVICES) {
      const link = screen.getByText(service.title).closest("a")!;
      expect(link).toHaveAttribute("href", `/services/${service.id}`);
    }
    expect(screen.getAllByRole("listitem")).toHaveLength(SERVICES.length);
  });

  it("unfolds a card with 'see more' while it is pointed at or focused", async () => {
    await renderCards();
    const row = screen.getByText(SERVICES[1]!.title).closest("li")!;
    expect(row).toHaveAttribute("data-open", "false");
    fireEvent.mouseEnter(row);
    expect(row).toHaveAttribute("data-open", "true");
    expect(row).toHaveTextContent("Տեսնել ավելին");
    fireEvent.mouseLeave(row.closest(".service-list")!);
    expect(row).toHaveAttribute("data-open", "false");
    fireEvent.focus(row.querySelector("a")!);
    expect(row).toHaveAttribute("data-open", "true");
  });

  it("opens the category page on click", async () => {
    const router = await renderCards();
    fireEvent.click(screen.getByText(SERVICES[2]!.title));
    await screen.findByText("service page");
    expect(router.state.location.pathname).toBe(`/services/${SERVICES[2]!.id}`);
  });

  it("every category has a price list", () => {
    for (const service of SERVICES) expect(service.items.length).toBeGreaterThan(0);
  });
});
