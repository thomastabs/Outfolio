import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  avatarFor,
  coverFor,
  fetchDeveloperByUsername,
  formatDateRange,
} from "@/lib/portfolio";

export const Route = createFileRoute("/u/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — OutSystems portfolio on Outfolio` },
      {
        name: "description",
        content: `Public OutSystems case studies by @${params.username} on Outfolio.`,
      },
      {
        property: "og:title",
        content: `@${params.username} — OutSystems portfolio on Outfolio`,
      },
      {
        property: "og:description",
        content: `Public OutSystems case studies by @${params.username} on Outfolio.`,
      },
    ],
  }),
  component: DeveloperPage,
  errorComponent: () => <ErrorState />,
  notFoundComponent: () => <ErrorState />,
});

function ErrorState() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-medium">Developer not found</h1>
        <p className="mt-2 text-ink-muted">This profile does not exist or has been removed.</p>
        <Link to="/developers" className="mt-6 inline-block text-sm underline">
          Back to directory
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function DeveloperPage() {
  const { username } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["developer", username],
    queryFn: async () => {
      const result = await fetchDeveloperByUsername(username);
      if (!result) throw notFound();
      return result;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-canvas text-ink">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-6 py-16 text-sm text-ink-muted">Loading profile…</div>
      </div>
    );
  }

  const { developer, projects } = data;
  const avatar = avatarFor(developer);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-10">
            {avatar ? (
              <img
                src={avatar}
                alt={developer.name}
                width={200}
                height={200}
                className="size-24 rounded-full object-cover ring-1 ring-hairline"
              />
            ) : null}
            <div className="flex-1">
              <span className="eyebrow">Developer</span>
              <h1 className="mt-2 text-4xl font-medium tracking-tight">{developer.name}</h1>
              <p className="mt-2 max-w-[52ch] text-ink-muted">{developer.headline}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-subtle">
                <span className="font-mono">@{developer.username}</span>
                {developer.location ? <span>{developer.location}</span> : null}
                {developer.years_experience ? (
                  <span>{developer.years_experience} yrs OutSystems experience</span>
                ) : null}
              </div>
            </div>
          </div>
          {developer.bio ? (
            <p className="mt-8 max-w-[64ch] text-pretty leading-relaxed text-ink-muted">
              {developer.bio}
            </p>
          ) : null}
          {developer.certifications && developer.certifications.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {developer.certifications.map((c) => (
                <span
                  key={c}
                  className="rounded border border-hairline bg-surface px-2 py-0.5 text-xs font-medium text-ink-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <span className="eyebrow">Case studies · {projects.length}</span>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.map((p) => {
              const cover = coverFor(p);
              return (
                <Link
                  key={p.id}
                  to="/u/$username/$slug"
                  params={{ username: developer.username, slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface transition-shadow hover:shadow-sm"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        width={1600}
                        height={900}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <span className="eyebrow">
                      {p.role} · {formatDateRange(p.start_date, p.end_date)}
                    </span>
                    <h3 className="text-lg font-medium leading-snug tracking-tight">{p.title}</h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {p.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}