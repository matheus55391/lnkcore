import { describe, expect, it } from "vitest";
import { isAllowedReportPageUrl } from "@/lib/report-page-url";

describe("isAllowedReportPageUrl", () => {
  it("accepts canonical makebio hosts", () => {
    expect(isAllowedReportPageUrl("https://www.makebio.com.br/alice")).toBe(
      true
    );
    expect(isAllowedReportPageUrl("https://makebio.com.br/alice")).toBe(true);
    expect(isAllowedReportPageUrl("http://www.makebio.com.br/alice")).toBe(
      true
    );
  });

  it("rejects foreign hosts and invalid URLs", () => {
    expect(isAllowedReportPageUrl("https://evil.com/makebio.com.br")).toBe(
      false
    );
    expect(isAllowedReportPageUrl("https://www.makebio.com.br.evil/x")).toBe(
      false
    );
    expect(isAllowedReportPageUrl("not-a-url")).toBe(false);
  });
});
