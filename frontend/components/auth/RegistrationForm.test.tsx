import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RegistrationForm } from "./RegistrationForm"

function fillForm(username: string, email: string, password: string) {
  return async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText(/username/i), username)
    await user.type(screen.getByLabelText(/email/i), email)
    await user.type(screen.getByLabelText(/password/i), password)
    await user.click(screen.getByRole("button", { name: /create account/i }))
  }
}

describe("RegistrationForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  it("blocks submission and shows an inline error for a malformed email", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)

    await fillForm("maya", "not-an-email", "hunter2pass")(user)

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("shows a username-taken error on 409", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 409,
      json: async () => ({ message: "This username is already taken." }),
    } as Response)
    const user = userEvent.setup()
    render(<RegistrationForm />)

    await fillForm("maya", "maya@example.com", "hunter2pass")(user)

    expect(await screen.findByText(/already taken/i)).toBeInTheDocument()
  })

  it("shows a success message on 200", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ userId: "user-123", message: "Account created and ready to use." }),
    } as Response)
    const user = userEvent.setup()
    render(<RegistrationForm />)

    await fillForm("maya", "maya@example.com", "hunter2pass")(user)

    await waitFor(() => expect(screen.getByText(/account created/i)).toBeInTheDocument())
  })
})
