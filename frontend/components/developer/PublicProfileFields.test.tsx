import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { PublicProfileFields } from "./PublicProfileFields"

describe("PublicProfileFields", () => {
  it("renders bio, certifications, and links when all are visible", () => {
    render(
      <PublicProfileFields
        bio="Low-code engineer"
        certifications={["OutSystems Expert"]}
        links={[{ label: "LinkedIn", url: "https://linkedin.com/in/maya" }]}
        fieldsVisible={{ bio: true, certifications: true, links: true }}
      />,
    )

    expect(screen.getByText("Low-code engineer")).toBeInTheDocument()
    expect(screen.getByText("OutSystems Expert")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/maya",
    )
  })

  it("omits fields marked not visible", () => {
    render(
      <PublicProfileFields
        bio="Low-code engineer"
        certifications={["OutSystems Expert"]}
        links={[{ label: "LinkedIn", url: "https://linkedin.com/in/maya" }]}
        fieldsVisible={{ bio: false, certifications: true, links: false }}
      />,
    )

    expect(screen.queryByText("Low-code engineer")).not.toBeInTheDocument()
    expect(screen.getByText("OutSystems Expert")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument()
  })

  it("gracefully handles missing or empty data without rendering empty sections", () => {
    render(
      <PublicProfileFields bio={undefined} certifications={[]} links={undefined} fieldsVisible={{}} />,
    )

    expect(screen.queryByText("About")).not.toBeInTheDocument()
    expect(screen.queryByText("Certifications")).not.toBeInTheDocument()
    expect(screen.queryByText("Links")).not.toBeInTheDocument()
  })
})
