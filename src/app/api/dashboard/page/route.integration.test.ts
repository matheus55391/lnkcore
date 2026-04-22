import { beforeEach, describe, expect, it, vi } from "vitest";

const guardsMock = vi.hoisted(() => ({
  requireSession: vi.fn(),
}));

const pageServiceMock = vi.hoisted(() => ({
  getPageByUserId: vi.fn(),
  updatePageByUserId: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => guardsMock);
vi.mock("@/modules/page/service", () => pageServiceMock);

import { GET, PATCH } from "./route";

describe("dashboard page API route", () => {
  beforeEach(() => {
    guardsMock.requireSession.mockReset();
    pageServiceMock.getPageByUserId.mockReset();
    pageServiceMock.updatePageByUserId.mockReset();
  });

  it("returns 401 when session is missing", async () => {
    guardsMock.requireSession.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("returns page for authenticated user", async () => {
    guardsMock.requireSession.mockResolvedValueOnce({ userId: "user_1" });
    pageServiceMock.getPageByUserId.mockResolvedValueOnce({ id: "page_1" });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.page).toEqual({ id: "page_1" });
  });

  it("updates page with authenticated ownership", async () => {
    guardsMock.requireSession.mockResolvedValueOnce({ userId: "user_1" });
    pageServiceMock.updatePageByUserId.mockResolvedValueOnce({ id: "page_1" });

    const request = new Request("http://localhost:3000/api/dashboard/page", {
      method: "PATCH",
      body: JSON.stringify({ slug: "novo-slug" }),
      headers: { "content-type": "application/json" },
    });

    const response = await PATCH(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.page).toEqual({ id: "page_1" });
  });
});
