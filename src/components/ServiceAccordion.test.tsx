import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceAccordion } from "./ServiceAccordion";
import { SERVICES } from "@/lib/clinic";

beforeEach(() => {
  vi.stubGlobal("PointerEvent", class extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerType = init.pointerType ?? "mouse"; }
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("Service accordion interaction", () => {
  it("opens every service by tap, switches panels, and keeps all rows visible", () => {
    render(<ServiceAccordion onBook={vi.fn()} />);
    for (const service of SERVICES) {
      const button = screen.getByRole("button", { name: service.title });
      fireEvent.pointerEnter(button.closest("li")!, { pointerType: "touch" });
      expect(button).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("region", { name: service.title })).toHaveTextContent(service.text);
      expect(screen.getAllByRole("region")).toHaveLength(1);
      expect(screen.getAllByRole("listitem")).toHaveLength(SERVICES.length);
      expect(button.closest("li")).not.toHaveClass("reveal");
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("ignores desktop hover and toggles only by click", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    render(<ServiceAccordion onBook={vi.fn()} />);
    const button = screen.getByRole("button", { name: SERVICES[0]!.title });
    const row = button.closest("li")!;
    fireEvent.pointerEnter(row, { pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.pointerLeave(row, { pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.blur(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps keyboard activation and Escape usable on a desktop", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    render(<ServiceAccordion onBook={vi.fn()} />);
    const button = screen.getByRole("button", { name: SERVICES[0]!.title });
    fireEvent.click(button, { detail: 0 });
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(button, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("books the service from its expanded panel", () => {
    const onBook = vi.fn();
    render(<ServiceAccordion onBook={onBook} />);
    fireEvent.click(screen.getByRole("button", { name: SERVICES[1]!.title }));
    fireEvent.click(screen.getByRole("button", { name: "Ամրագրել այս ծառայության համար" }));
    expect(onBook).toHaveBeenCalledWith(SERVICES[1]!.title);
  });
});
