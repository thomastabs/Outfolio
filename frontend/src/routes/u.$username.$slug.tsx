import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Lock, Mail } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  avatarFor,
  coverFor,
  fetchProject,
  formatBytes,
  formatDateRange,
} from "@/lib/portfolio";

export const Route = createFileRoute("/u/$username/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Outfolio case study` },
      {
        name: "description",
        content: `An OutSystems case study by @${params.username} on Outfolio.`,
      },
      {
        property: "og:title",
        content: `${params.slug.replace(/-/g, " ")} — Outfolio case study`,
      },
      {
        property: "og:description",
        content: `An OutSystems case study by @${params.username} on Outfolio.`,
      },
    ],
  }),
  component: ProjectPage,
  errorComponent: () => <NotFoundState />,
  notFoundComponent: () => <NotFoundState />,
});

function NotFoundState() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-medium">Case study not found</h1>
        <Link to="/developers" className="mt-6 inline-block text-sm underline">
          Back to directory
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function ProjectPage() {
  const { username, slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["project", username, slug],
    queryFn: async () => {
      const result = await fetchProject(username, slug);
      if (!result) throw notFound();
      return result;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-canvas text-ink">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-6 py-16 text-sm text-ink-muted">
          Loading case study…
        </div>
      </div>
    );
  }

  const { developer, project, sections, artifacts } = data;
  const avatar = avatarFor(developer);
  const cover = coverFor(project);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Header */}
        <header className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/u/$username"
              params={{ username: developer.username }}
              className="flex items-center gap-3 rounded-full bg-surface p-1.5 pr-4 ring-1 ring-hairline transition-colors hover:bg-muted"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  width={64}
                  height={64}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span className="size-8 rounded-full bg-muted" />
              )}
              <div className="flex flex-col leading-none">
                <span className="text-xs font-medium">{developer.name}</span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                  {project.role}
                </span>
              </div>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <StatusPill status={project.status} />
              <span className="rounded border border-hairline bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                Public case study
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-[24ch] text-balance text-3xl font-medium tracking-tight md:text-4xl">
              {project.title}
            </h1>
            <p className="max-w-[64ch] text-pretty text-lg leading-relaxed text-ink-muted">
              {project.summary}
            </p>
          </div>

          {cover ? (
            <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
              <img
                src={cover}
                alt=""
                width={1600}
                height={900}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}
        </header>

        {/* Body + rail */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px] lg:gap-20">
          <div className="space-y-14">
            {sections.map((s) => (
              <section key={s.id} id={s.section_type} className="space-y-4">
                <h2 className="eyebrow">{s.title}</h2>
                <p className="max-w-[64ch] text-pretty leading-relaxed text-ink">{s.body}</p>
              </section>
            ))}

            <section className="space-y-4">
              <h2 className="eyebrow">Artifacts</h2>
              <p className="max-w-[64ch] text-sm text-ink-muted">
                Uploaded evidence. Private artifacts are only listed by filename — request access
                to see contents.
              </p>
              <ul className="flex flex-col gap-2">
                {artifacts.length === 0 ? (
                  <li className="rounded-md border border-dashed border-hairline p-4 text-sm text-ink-subtle">
                    No artifacts uploaded yet.
                  </li>
                ) : (
                  artifacts.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-dashed border-hairline bg-canvas p-3"
                    >
                      <div className="flex items-center gap-3">
                        {a.visibility === "private" ? (
                          <Lock className="size-4 text-ink-subtle" />
                        ) : (
                          <FileText className="size-4 text-ink-subtle" />
                        )}
                        <span className="text-sm text-ink">{a.file_name}</span>
                        <span className="font-mono text-[11px] text-ink-subtle">
                          {formatBytes(a.size_bytes)}
                        </span>
                      </div>
                      <span
                        className={
                          a.visibility === "private"
                            ? "text-[10px] font-semibold uppercase tracking-wide text-ink-subtle"
                            : "text-[10px] font-semibold uppercase tracking-wide text-[color:var(--brand)]"
                        }
                      >
                        {a.visibility}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          {/* Metadata rail */}
          <aside className="hidden h-fit space-y-10 lg:sticky lg:top-24 lg:block">
            <div className="space-y-4">
              <h3 className="eyebrow">Project details</h3>
              <dl className="space-y-4">
                <MetaRow label="My role" value={project.role} />
                <MetaRow label="OutSystems version" value={project.outsystems_version} />
                <MetaRow label="Environment" value={project.environment_type} />
                <MetaRow
                  label="Timeframe"
                  value={formatDateRange(project.start_date, project.end_date)}
                />
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    Status
                  </dt>
                  <dd className="mt-1">
                    <StatusPill status={project.status} />
                  </dd>
                </div>
              </dl>
            </div>

            {project.tags && project.tags.length > 0 ? (
              <div>
                <h3 className="eyebrow mb-3">Stack &amp; tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-hairline bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl bg-ink p-4 text-canvas">
              <p className="text-xs leading-relaxed opacity-80">
                Want to talk to {developer.name.split(" ")[0]} about this project?
              </p>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-canvas px-3 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90">
                <Mail className="size-4" />
                Message {developer.name.split(" ")[0]}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string | null }) {
  if (!status) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-[color:var(--brand)]/20 bg-[color:var(--brand-soft)] px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[color:var(--brand)]">
      <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
      {status}
    </span>
  );
}