import { describe, expect, it } from "vitest";
import { sortLinksByPosition } from "./link";

describe("sortLinksByPosition", () => {
  it("orders by position ascending", () => {
    const ordered = sortLinksByPosition([
      { position: 2, title: "HS decks" },
      { position: 0, title: "Portfolio" },
      { position: 1, title: "Meio" },
    ]);

    expect(ordered.map((link) => link.title)).toEqual([
      "Portfolio",
      "Meio",
      "HS decks",
    ]);
  });

  it("returns an empty array for missing links", () => {
    expect(sortLinksByPosition(undefined)).toEqual([]);
    expect(sortLinksByPosition(null)).toEqual([]);
  });
});
