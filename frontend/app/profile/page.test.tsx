import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

const { cookiesMock, redirectMock, pushMock, refreshMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  redirectMock: vi.fn(),
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
}))

vi.mock("next/headers", () => ({ cookies: cookiesMock }))
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}))

import ProfilePage from "./page"

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
    redirectMock.mockReset()
    cookiesMock.mockResolvedValue({ get: () => ({ value: "valid-jwt" }) })
  })

  it("fetches the profile (including visibilitySettings) and passes it to child components", async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        username: "maya",
        name: "Maya Okafor",
        bio: "Low-code engineer",
        experienceYears: 7,
        certifications: ["OutSystems Expert"],
        links: [],
        visibilitySettings: { visibility: "private", fieldVisibility: { bio: "private" } },
      }),
    } as Response)

    const jsx = await ProfilePage()
    render(jsx)

    expect(screen.getByDisplayValue("Maya Okafor")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /profile visibility/i })).toBeInTheDocument()
    expect((screen.getByLabelText(/show bio on public profile/i) as HTMLInputElement).checked).toBe(false)
  })

  it("redirects to /login when there is no session cookie", async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined })
    redirectMock.mockImplementation(() => {
      throw new Error("REDIRECT")
    })

    await expect(ProfilePage()).rejects.toThrow("REDIRECT")
    expect(redirectMock).toHaveBeenCalledWith("/login")
  })

  it("redirects to /login when the backend rejects the token", async () => {
    vi.mocked(fetch).mockResolvedValue({ status: 401, json: async () => ({}) } as Response)
    redirectMock.mockImplementation(() => {
      throw new Error("REDIRECT")
    })

    await expect(ProfilePage()).rejects.toThrow("REDIRECT")
    expect(redirectMock).toHaveBeenCalledWith("/login")
  })
})
