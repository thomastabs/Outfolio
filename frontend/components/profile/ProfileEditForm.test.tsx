import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProfileEditForm, type ProfileFormData } from "./ProfileEditForm"

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: refreshMock }),
}))

const initialValues: ProfileFormData = {
  name: "Maya Okafor",
  bio: "Low-code engineer",
  experienceYears: 7,
  certifications: [],
  links: [],
}

describe("ProfileEditForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
    refreshMock.mockClear()
  })

  it("blocks submission and shows an error when name is cleared", async () => {
    const user = userEvent.setup()
    render(<ProfileEditForm initialValues={initialValues} />)

    await user.clear(screen.getByLabelText(/^name$/i))
    await user.click(screen.getByRole("button", { name: /save changes/i }))

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("blocks submission and shows an error for an invalid link URL", async () => {
    const user = userEvent.setup()
    render(<ProfileEditForm initialValues={initialValues} />)

    await user.click(screen.getByRole("button", { name: /add link/i }))
    await user.type(screen.getByPlaceholderText(/https:\/\//i), "not-a-url")
    await user.click(screen.getByRole("button", { name: /save changes/i }))

    expect(await screen.findByText(/enter valid urls/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("submits valid data and refreshes on success", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ success: true, message: "Profile updated." }),
    } as Response)
    const user = userEvent.setup()
    render(<ProfileEditForm initialValues={initialValues} />)

    await user.type(screen.getByLabelText(/certifications/i), "OutSystems Expert{enter}")
    await user.click(screen.getByRole("button", { name: /save changes/i }))

    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(options?.body as string)
    expect(body.certifications).toEqual(["OutSystems Expert"])
    expect(body.name).toBe("Maya Okafor")
  })
})
