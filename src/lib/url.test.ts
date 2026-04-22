import { describe, expect, it } from "vitest";
import { sanitizeUrl } from "./url";

describe("sanitizeUrl", () => {
  it("accepts https urls", () => {
    expect(sanitizeUrl("https://lnkcore.com.br")).toBe(
      "https://lnkcore.com.br/",
    );
  });

  it("rejects javascript protocol", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects invalid urls", () => {
    expect(sanitizeUrl("notaurl")).toBeNull();
  });
});
