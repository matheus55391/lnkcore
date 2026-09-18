import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isOwnedStorageKey,
  keyFromPublicUrl,
} from "@/lib/storage/key-from-url";
import {
  assertOwnedImageUrl,
  normalizeOwnedImageUrl,
  OwnedImageError,
} from "@/lib/storage-cleanup";

describe("keyFromPublicUrl / ownership", () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env.S3_PUBLIC_URL = "https://cdn.example.com";
    delete process.env.S3_ENDPOINT;
  });

  afterEach(() => {
    process.env = { ...prev };
  });

  it("extracts key from public base URL", () => {
    expect(
      keyFromPublicUrl("https://cdn.example.com/user-1/pages/p1/avatar.webp")
    ).toBe("user-1/pages/p1/avatar.webp");
  });

  it("returns null for foreign hosts", () => {
    expect(keyFromPublicUrl("https://evil.com/user-1/x.webp")).toBeNull();
  });

  it("isOwnedStorageKey requires userId prefix", () => {
    expect(isOwnedStorageKey("user-1/a.webp", "user-1")).toBe(true);
    expect(isOwnedStorageKey("user-2/a.webp", "user-1")).toBe(false);
    expect(isOwnedStorageKey(null, "user-1")).toBe(false);
  });

  it("assertOwnedImageUrl accepts owned URLs", () => {
    expect(
      assertOwnedImageUrl(
        "https://cdn.example.com/user-1/pages/p1/avatar.webp",
        "user-1"
      )
    ).toBe("user-1/pages/p1/avatar.webp");
  });

  it("assertOwnedImageUrl rejects other users' keys", () => {
    expect(() =>
      assertOwnedImageUrl(
        "https://cdn.example.com/user-2/pages/p1/avatar.webp",
        "user-1"
      )
    ).toThrow(OwnedImageError);
  });

  it("normalizeOwnedImageUrl allows null clear and rejects foreign URLs", () => {
    expect(normalizeOwnedImageUrl(null, "user-1")).toBeNull();
    expect(normalizeOwnedImageUrl(undefined, "user-1")).toBeUndefined();
    expect(() =>
      normalizeOwnedImageUrl("https://cdn.example.com/other/x.webp", "user-1")
    ).toThrow(OwnedImageError);
  });
});
