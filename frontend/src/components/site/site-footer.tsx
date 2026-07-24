import { Link } from "@tanstack/react-router";
import { LogoMark } from "./logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="opacity-70">
          <LogoMark />
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-ink-subtle">
          <Link to="/" className="transition-colors hover:text-ink">Overview</Link>
          <Link to="/developers" className="transition-colors hover:text-ink">Directory</Link>
          <Link to="/try" className="transition-colors hover:text-ink">AI generator</Link>
          <span className="hidden text-ink-subtle/60 md:inline">
            Independent tool. Not affiliated with OutSystems.
          </span>
        </nav>
      </div>
    </footer>
  );
}