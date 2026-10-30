import { describe, expect, it } from "vitest";
import { buildUploadObjectKey } from "./upload-key";

describe("buildUploadObjectKey", () => {
  it("nests under user, folder and entity with a unique filename", () => {
    expect(buildUploadObjectKey("user-1", "pages", "page-1", "abc")).toBe(
      "user-1/pages/page-1/abc.webp"
    );
  });

  it("omits entity when missing", () => {
    expect(buildUploadObjectKey("user-1", "misc", undefined, "abc")).toBe(
      "user-1/misc/abc.webp"
    );
  });
});
