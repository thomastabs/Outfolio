import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockFrom, mockCreateUser, mockDeleteUser } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockCreateUser: vi.fn(),
  mockDeleteUser: vi.fn(),
}));

vi.mock("../../../lib/supabaseClient.js", () => ({
  supabaseAdmin: {
    from: mockFrom,
    auth: { admin: { createUser: mockCreateUser, deleteUser: mockDeleteUser } },
  },
}));

function usersTable(maybeSingleResult: { data: unknown; error: unknown }) {
  return {
    select: () => ({
      eq: () => ({
        maybeSingle: async () => maybeSingleResult,
      }),
    }),
    insert: vi.fn(async () => ({ error: null })),
  };
}

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with userId on valid unique registration", async () => {
    const table = usersTable({ data: null, error: null });
    mockFrom.mockReturnValue(table);
    mockCreateUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });

    const { default: app } = await import("./register.js");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "maya", email: "maya@example.com", password: "hunter2pass" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: "user-123", message: expect.any(String) });
    expect(table.insert).toHaveBeenCalledWith({ user_id: "user-123", username: "maya", email: "maya@example.com" });
  });

  it("returns 409 when username is already taken", async () => {
    mockFrom.mockReturnValue(usersTable({ data: { user_id: "existing" }, error: null }));

    const { default: app } = await import("./register.js");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "maya", email: "maya@example.com", password: "hunter2pass" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("username_taken");
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it("returns 422 when Supabase Auth rejects the email as invalid", async () => {
    mockFrom.mockReturnValue(usersTable({ data: null, error: null }));
    mockCreateUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Unable to validate email address: invalid format" },
    });

    const { default: app } = await import("./register.js");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "maya", email: "not-an-email", password: "hunter2pass" });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe("invalid_email");
  });

  it("returns 400 when a required field is missing", async () => {
    const { default: app } = await import("./register.js");
    const res = await request(app).post("/api/v1/auth/register").send({ username: "maya" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_input");
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
