import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProfileVisibilitySettings } from "./ProfileVisibilitySettings"

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: refreshMock }),
}))

describe("ProfileVisibilitySettings", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
    refreshMock.mockClear()
  })

  it("renders the current overall visibility and per-field toggle states", () => {
    render(
      <ProfileVisibilitySettings initialSettings={{ visibility: "public", fieldVisibility: { bio: "private" } }} />,
    )

    // Base UI's Select doesn't resolve its displayed label under jsdom
    // without opening the listbox first, so we assert on the combobox
    // trigger existing rather than the rendered "Public" text.
    expect(screen.getByRole("combobox", { name: /profile visibility/i })).toBeInTheDocument()
    expect((screen.getByLabelText(/show bio on public profile/i) as HTMLInputElement).checked).toBe(false)
    expect((screen.getByLabelText(/show name on public profile/i) as HTMLInputElement).checked).toBe(true)
  })

  it("toggles a field's visibility", async () => {
    const user = userEvent.setup()
    render(<ProfileVisibilitySettings initialSettings={{ visibility: "public", fieldVisibility: {} }} />)

    const bioToggle = screen.getByLabelText(/show bio on public profile/i) as HTMLInputElement
    expect(bioToggle.checked).toBe(true)

    await user.click(bioToggle)
    expect(bioToggle.checked).toBe(false)
  })

  it("saves visibility settings via PUT /api/profile/visibility", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ success: true, message: "Visibility settings updated." }),
    } as Response)
    const user = userEvent.setup()
    render(<ProfileVisibilitySettings initialSettings={{ visibility: "public", fieldVisibility: {} }} />)

    await user.click(screen.getByLabelText(/show bio on public profile/i))
    await user.click(screen.getByRole("button", { name: /save visibility settings/i }))

    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe("/api/profile/visibility")
    const body = JSON.parse(options?.body as string)
    expect(body.visibility).toBe("public")
    expect(body.fieldVisibility.bio).toBe("private")
  })
})
