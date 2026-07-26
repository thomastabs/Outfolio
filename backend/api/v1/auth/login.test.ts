import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockFrom, mockSignIn } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockSignIn: vi.fn(),
}));

vi.mock("../../../lib/supabaseClient.js", () => ({
  supabaseAdmin: {
    from: mockFrom,
    auth: { signInWithPassword: mockSignIn },
  },
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

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with token and userId on valid credentials", async () => {
    mockFrom.mockReturnValue(usersTable({ data: { email: "maya@example.com" }, error: null }));
    mockSignIn.mockResolvedValue({
      data: { session: { access_token: "jwt-abc" }, user: { id: "user-123" } },
      error: null,
    });

    const { default: app } = await import("./login.js");
    const res = await request(app).post("/api/v1/auth/login").send({ username: "maya", password: "hunter2pass" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "jwt-abc", userId: "user-123" });
  });

  it("returns 401 when the password is wrong", async () => {
    mockFrom.mockReturnValue(usersTable({ data: { email: "maya@example.com" }, error: null }));
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: "Invalid login credentials" } });

    const { default: app } = await import("./login.js");
    const res = await request(app).post("/api/v1/auth/login").send({ username: "maya", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("invalid_credentials");
  });

  it("returns 404 when the username doesn't exist", async () => {
    mockFrom.mockReturnValue(usersTable({ data: null, error: null }));

    const { default: app } = await import("./login.js");
    const res = await request(app).post("/api/v1/auth/login").send({ username: "ghost", password: "hunter2pass" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("user_not_found");
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
