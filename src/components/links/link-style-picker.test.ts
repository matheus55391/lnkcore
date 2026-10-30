import { describe, expect, it } from "vitest";
import {
  ClassicLinkStyle,
  FeaturedSize,
  LinkType,
} from "@/@types/link";
import {
  isFeaturedStyle,
  resolveClassicStyle,
  styleToLinkFields,
} from "./link-style-picker";

describe("resolveClassicStyle", () => {
  it("maps featured compact and tall", () => {
    expect(resolveClassicStyle(LinkType.FEATURED)).toBe(
      ClassicLinkStyle.FEATURED
    );
    expect(
      resolveClassicStyle(LinkType.FEATURED, FeaturedSize.COMPACT)
    ).toBe(ClassicLinkStyle.FEATURED);
    expect(resolveClassicStyle(LinkType.FEATURED, FeaturedSize.TALL)).toBe(
      ClassicLinkStyle.FEATURED_TALL
    );
    expect(resolveClassicStyle(LinkType.CLASSIC, FeaturedSize.TALL)).toBe(
      ClassicLinkStyle.CLASSIC
    );
  });
});

describe("styleToLinkFields", () => {
  it("writes type and featuredSize together", () => {
    expect(styleToLinkFields(ClassicLinkStyle.CLASSIC)).toEqual({
      type: LinkType.CLASSIC,
      featuredSize: FeaturedSize.COMPACT,
    });
    expect(styleToLinkFields(ClassicLinkStyle.FEATURED)).toEqual({
      type: LinkType.FEATURED,
      featuredSize: FeaturedSize.COMPACT,
    });
    expect(styleToLinkFields(ClassicLinkStyle.FEATURED_TALL)).toEqual({
      type: LinkType.FEATURED,
      featuredSize: FeaturedSize.TALL,
    });
  });
});

describe("isFeaturedStyle", () => {
  it("is true for compact and tall featured", () => {
    expect(isFeaturedStyle(ClassicLinkStyle.CLASSIC)).toBe(false);
    expect(isFeaturedStyle(ClassicLinkStyle.FEATURED)).toBe(true);
    expect(isFeaturedStyle(ClassicLinkStyle.FEATURED_TALL)).toBe(true);
  });
});
