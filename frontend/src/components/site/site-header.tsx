import { Link } from "@tanstack/react-router";
import { LogoMark } from "./logo-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <LogoMark />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/developers"
            className="text-ink-muted transition-colors hover:text-ink"
            activeProps={{ className: "text-ink" }}
          >
            Directory
          </Link>
          <Link
            to="/try"
            className="text-ink-muted transition-colors hover:text-ink"
            activeProps={{ className: "text-ink" }}
          >
            AI generator
          </Link>
          <Link
            to="/u/$username/$slug"
            params={{ username: "marcus-arlow", slug: "healthchain-patient-records" }}
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-canvas transition-opacity hover:opacity-90"
          >
            View a case study
          </Link>
        </nav>
      </div>
    </header>
  );
}