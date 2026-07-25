import Link from "next/link"
import { Layers } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Outfolio</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The portfolio platform built for OutSystems and low-code developers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterCol
            title="Product"
            links={[
              { label: "Discover", href: "/discover" },
              { label: "Create a project", href: "/new" },
              { label: "Developers", href: "/developer/maya-okafor" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: "Guides", href: "#" },
              { label: "Templates", href: "#" },
              { label: "Changelog", href: "#" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{"\u00A9"} 2026 Outfolio. A prototype, not affiliated with OutSystems.</p>
          <p>Built for low-code builders.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
