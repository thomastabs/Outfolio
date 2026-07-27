import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockFrom, mockGetUser } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockGetUser: vi.fn(),
}));

vi.mock("../../../../../lib/supabaseClient.js", () => ({
  supabaseAdmin: {
    from: mockFrom,
    auth: { getUser: mockGetUser },
  },
}));

const VALID_TOKEN = "valid-jwt";

function mockValidAuth() {
  mockGetUser.mockImplementation(async (token: string) =>
    token === VALID_TOKEN
      ? { data: { user: { id: "user-123" } }, error: null }
      : { data: { user: null }, error: { message: "invalid token" } },
  );
}

describe("PUT /api/v1/users/me/profile/visibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidAuth();
  });

  it("returns 200 and updates visibility on valid input", async () => {
    const update = vi.fn(() => ({ eq: async () => ({ error: null }) }));
    mockFrom.mockReturnValue({ update });

    const { default: app } = await import("./visibility.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile/visibility")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ visibility: "public", fieldVisibility: {} });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ visibility_settings: { visibility: "public", fieldVisibility: {} } }),
    );
  });

  it("returns 401 without authentication", async () => {
    const { default: app } = await import("./visibility.js");
    const res = await request(app).put("/api/v1/users/me/profile/visibility").send({ visibility: "public" });
    expect(res.status).toBe(401);
  });

  it("returns 400 for an invalid visibility value", async () => {
    const { default: app } = await import("./visibility.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile/visibility")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ visibility: "hidden" });

    expect(res.status).toBe(400);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("saves partial field-level visibility settings", async () => {
    const update = vi.fn(() => ({ eq: async () => ({ error: null }) }));
    mockFrom.mockReturnValue({ update });

    const { default: app } = await import("./visibility.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile/visibility")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ visibility: "private", fieldVisibility: { name: "public", bio: "private", links: "private" } });

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        visibility_settings: {
          visibility: "private",
          fieldVisibility: { name: "public", bio: "private", links: "private" },
        },
      }),
    );
  });
});
