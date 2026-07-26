import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginForm } from "./LoginForm"

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
}))

async function submit(user: ReturnType<typeof userEvent.setup>, username: string, password: string) {
  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole("button", { name: /log in/i }))
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
    pushMock.mockClear()
  })

  it("persists the session and redirects to /profile on success", async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes("/api/v1/auth/login")) {
        return { status: 200, json: async () => ({ token: "jwt-abc", userId: "user-123" }) } as Response
      }
      return { status: 200, json: async () => ({ success: true }) } as Response
    })
    const user = userEvent.setup()
    render(<LoginForm />)

    await submit(user, "maya", "hunter2pass")

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/profile"))
    expect(fetch).toHaveBeenCalledWith(
      "/api/session",
      expect.objectContaining({ body: JSON.stringify({ token: "jwt-abc" }) }),
    )
  })

  it("shows an invalid-credentials error on 401 without redirecting", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 401,
      json: async () => ({ message: "Incorrect username or password." }),
    } as Response)
    const user = userEvent.setup()
    render(<LoginForm />)

    await submit(user, "maya", "wrongpass")

    expect(await screen.findByText(/incorrect username or password/i)).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it("shows an account-not-found error on 404", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 404,
      json: async () => ({ message: "We couldn't find an account with that username." }),
    } as Response)
    const user = userEvent.setup()
    render(<LoginForm />)

    await submit(user, "ghost", "hunter2pass")

    expect(await screen.findByText(/couldn't find an account/i)).toBeInTheDocument()
  })
})
