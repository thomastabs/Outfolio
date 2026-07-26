import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockFrom, mockGetUser } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockGetUser: vi.fn(),
}));

vi.mock("../../../../lib/supabaseClient.js", () => ({
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

describe("GET /api/v1/users/me/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidAuth();
  });

  it("returns 200 with profile data for a valid bearer token", async () => {
    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              username: "maya",
              name: "Maya Okafor",
              bio: "Low-code engineer",
              experience_years: 7,
              certifications: ["OutSystems Expert"],
              links: [{ label: "LinkedIn", url: "https://linkedin.com/in/maya" }],
              visibility_settings: {},
            },
            error: null,
          }),
        }),
      }),
    });

    const { default: app } = await import("./profile.js");
    const res = await request(app).get("/api/v1/users/me/profile").set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: "maya", name: "Maya Okafor", experienceYears: 7 });
  });

  it("returns 401 with no Authorization header", async () => {
    const { default: app } = await import("./profile.js");
    const res = await request(app).get("/api/v1/users/me/profile");
    expect(res.status).toBe(401);
  });

  it("returns 401 with an invalid bearer token", async () => {
    const { default: app } = await import("./profile.js");
    const res = await request(app).get("/api/v1/users/me/profile").set("Authorization", "Bearer garbage");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/v1/users/me/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidAuth();
  });

  it("returns 200 and updates on valid data", async () => {
    const update = vi.fn(() => ({ eq: async () => ({ error: null }) }));
    mockFrom.mockReturnValue({ update });

    const { default: app } = await import("./profile.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ name: "Maya O.", bio: "Updated bio" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ name: "Maya O.", bio: "Updated bio" }));
  });

  it("returns 400 when name is missing", async () => {
    const { default: app } = await import("./profile.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ bio: "no name provided" });

    expect(res.status).toBe(400);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns 422 and does not save when a link URL is invalid", async () => {
    const update = vi.fn();
    mockFrom.mockReturnValue({ update });

    const { default: app } = await import("./profile.js");
    const res = await request(app)
      .put("/api/v1/users/me/profile")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ name: "Maya O.", links: [{ label: "Site", url: "not-a-url" }] });

    expect(res.status).toBe(422);
    expect(update).not.toHaveBeenCalled();
  });
});
