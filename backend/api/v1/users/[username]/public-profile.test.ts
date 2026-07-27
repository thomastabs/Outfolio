import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }));

vi.mock("../../../../lib/supabaseClient.js", () => ({
  supabaseAdmin: { from: mockFrom },
}));

function usersTable(maybeSingleResult: { data: unknown; error: unknown }) {
  return {
    select: () => ({
      eq: () => ({
        maybeSingle: async () => maybeSingleResult,
      }),
    }),
  };
}

describe("GET /api/v1/users/:username/public-profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns full profile data when visibility is public with no field restrictions", async () => {
    mockFrom.mockReturnValue(
      usersTable({
        data: {
          username: "maya",
          name: "Maya Okafor",
          bio: "Low-code engineer",
          experience_years: 7,
          certifications: ["OutSystems Expert"],
          links: [{ label: "LinkedIn", url: "https://linkedin.com/in/maya" }],
          visibility_settings: { visibility: "public", fieldVisibility: {} },
        },
        error: null,
      }),
    );

    const { default: app } = await import("./public-profile.js");
    const res = await request(app).get("/api/v1/users/maya/public-profile");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: "maya", name: "Maya Okafor", experienceYears: 7 });
    expect(res.body.fieldsVisible).toEqual({
      name: true,
      bio: true,
      experienceYears: true,
      certifications: true,
      links: true,
    });
  });

  it("returns 403 when the profile is private", async () => {
    mockFrom.mockReturnValue(
      usersTable({
        data: { username: "maya", visibility_settings: { visibility: "private", fieldVisibility: {} } },
        error: null,
      }),
    );

    const { default: app } = await import("./public-profile.js");
    const res = await request(app).get("/api/v1/users/maya/public-profile");

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("profile_private");
  });

  it("omits fields marked private in fieldVisibility", async () => {
    mockFrom.mockReturnValue(
      usersTable({
        data: {
          username: "maya",
          name: "Maya Okafor",
          bio: "Low-code engineer",
          experience_years: 7,
          certifications: ["OutSystems Expert"],
          links: [],
          visibility_settings: {
            visibility: "public",
            fieldVisibility: { bio: "private", experienceYears: "private" },
          },
        },
        error: null,
      }),
    );

    const { default: app } = await import("./public-profile.js");
    const res = await request(app).get("/api/v1/users/maya/public-profile");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Maya Okafor");
    expect(res.body.bio).toBeUndefined();
    expect(res.body.experienceYears).toBeUndefined();
    expect(res.body.fieldsVisible).toMatchObject({ bio: false, experienceYears: false, name: true });
  });

  it("returns 404 when the username doesn't exist", async () => {
    mockFrom.mockReturnValue(usersTable({ data: null, error: null }));

    const { default: app } = await import("./public-profile.js");
    const res = await request(app).get("/api/v1/users/ghost/public-profile");

    expect(res.status).toBe(404);
  });
});
