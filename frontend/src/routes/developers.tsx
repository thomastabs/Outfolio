import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { avatarFor, fetchDevelopers } from "@/lib/portfolio";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Directory — OutSystems developers on Outfolio" },
      {
        name: "description",
        content:
          "Browse OutSystems developers publishing public case studies of their platform work on Outfolio.",
      },
      { property: "og:title", content: "Directory — OutSystems developers on Outfolio" },
      {
        property: "og:description",
        content: "Browse OutSystems developers publishing public case studies on Outfolio.",
      },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  const { data: developers = [], isLoading } = useQuery({
    queryKey: ["developers"],
    queryFn: fetchDevelopers,
  });

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="eyebrow">Directory</span>
          <h1 className="mt-3 max-w-[22ch] text-4xl font-medium tracking-tight">
            OutSystems developers on Outfolio
          </h1>
          <p className="mt-4 max-w-[56ch] text-ink-muted">
            A small, growing set of practitioners publishing public case studies of their
            OutSystems work. Follow a profile to see how they describe modules, integrations,
            and business impact.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12">
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading directory…</p>
          ) : (
            <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface">
              {developers.map((d) => {
                const avatar = avatarFor(d);
                return (
                  <li key={d.id}>
                    <Link
                      to="/u/$username"
                      params={{ username: d.username }}
                      className="flex items-center gap-5 p-6 transition-colors hover:bg-muted"
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          width={80}
                          height={80}
                          loading="lazy"
                          className="size-14 rounded-full object-cover ring-1 ring-hairline"
                        />
                      ) : (
                        <span className="size-14 rounded-full bg-muted ring-1 ring-hairline" />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2 className="text-lg font-medium tracking-tight">{d.name}</h2>
                          <span className="font-mono text-xs text-ink-subtle">@{d.username}</span>
                          {d.location ? (
                            <span className="text-xs text-ink-subtle">{d.location}</span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">{d.headline}</p>
                      </div>
                      <span className="hidden text-xs text-ink-subtle md:inline">View profile →</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}