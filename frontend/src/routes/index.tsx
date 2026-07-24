import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { avatarFor, coverFor, fetchFeaturedProjects } from "@/lib/portfolio";
import heroBlueprint from "@/assets/hero-blueprint.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Outfolio — Public case studies for OutSystems developers" },
      {
        name: "description",
        content:
          "The structured portfolio platform for OutSystems developers. Turn private OML projects into shareable, privacy-safe case studies.",
      },
      { property: "og:title", content: "Outfolio — Public case studies for OutSystems developers" },
      {
        property: "og:description",
        content:
          "GitHub shows source code. Outfolio shows OutSystems work: architecture, screens, integrations, and the humans who built them.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: fetchFeaturedProjects,
  });

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div className="flex flex-col justify-center gap-6">
            <span className="eyebrow">A portfolio layer for OutSystems</span>
            <h1 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              Visual development needs better documentation.
            </h1>
            <p className="max-w-[56ch] text-pretty text-lg leading-relaxed text-ink-muted">
              GitHub shows your code. Outfolio shows your architecture, your logic flows, your
              integrations, and your business impact — the parts of OutSystems work that a
              private OML file never can.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/try"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
              >
                Try the AI case study generator
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/developers"
                className="inline-flex items-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-hairline transition-colors hover:bg-muted"
              >
                Browse the directory
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface">
            <img
              src={heroBlueprint}
              alt="Illustration of module cards and arrows representing an OutSystems project blueprint"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-3 max-w-[24ch] text-3xl font-medium tracking-tight">
            A structured case study for every OutSystems project you ship.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-3">
                <span className="eyebrow">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Recently published</span>
              <h2 className="mt-3 text-3xl font-medium tracking-tight">Case studies</h2>
            </div>
            <Link
              to="/developers"
              className="hidden text-sm text-ink-muted transition-colors hover:text-ink md:inline"
            >
              See the directory →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {projects.map((p) => {
              const cover = coverFor(p);
              const avatar = avatarFor(p.developer);
              return (
                <Link
                  key={p.id}
                  to="/u/$username/$slug"
                  params={{ username: p.developer.username, slug: p.slug }}
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
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex flex-wrap gap-1.5">
                      {(p.tags ?? []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-medium leading-snug tracking-tight">{p.title}</h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {p.summary}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          width={40}
                          height={40}
                          loading="lazy"
                          className="size-6 rounded-full object-cover ring-1 ring-hairline"
                        />
                      ) : (
                        <span className="size-6 rounded-full bg-muted ring-1 ring-hairline" />
                      )}
                      <span className="text-xs text-ink-muted">
                        {p.developer.name} · {p.role ?? "Developer"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow">Principles</span>
              <h2 className="mt-3 max-w-[16ch] text-3xl font-medium tracking-tight">
                Represent OutSystems work honestly.
              </h2>
            </div>
            <div className="space-y-6 text-ink-muted">
              <p className="text-pretty leading-relaxed">
                Outfolio is not trying to render your .oml as a running app. It creates a
                project inspection model suited to OutSystems: modules, screens, flows,
                entities, integrations, roles, timers, business logic, and delivery context.
              </p>
              <p className="text-pretty leading-relaxed">
                Every project is public, private, unlisted, or anonymized. Uploaded artifacts
                stay private by default. AI drafts are editable before publishing and flag
                anything that reads like a sensitive client detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    title: "Describe the project",
    body: "Add title, role, OutSystems version, screens, entities, integrations, and what you personally contributed.",
  },
  {
    title: "Upload evidence",
    body: "Screenshots, architecture diagrams, ERDs, .oml / .oap exports, PDFs. Private by default with redaction guidance.",
  },
  {
    title: "Let AI draft the case study",
    body: "Outfolio turns your notes into a structured public page you can edit, redact, and publish under your name.",
  },
];
