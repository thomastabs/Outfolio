import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layers, Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Outfolio</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/discover"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Discover
            </Link>
            <Link
              href="/developer/maya-okafor"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Developers
            </Link>
            <Link
              href="/new"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Create
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/discover"
            aria-label="Search projects"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/discover">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/new">Start your portfolio</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
