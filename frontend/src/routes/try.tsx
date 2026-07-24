import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles, Upload, X } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { generateCaseStudy, type CaseStudyDraft } from "@/lib/ai.functions";

export const Route = createFileRoute("/try")({
  head: () => ({
    meta: [
      { title: "Try the AI case study generator — Outfolio" },
      {
        name: "description",
        content:
          "Paste your OutSystems project notes, upload screenshots or .oml artifacts, and get a structured case study draft in seconds.",
      },
      { property: "og:title", content: "Try the AI case study generator — Outfolio" },
      {
        property: "og:description",
        content: "Turn rough OutSystems project notes into a structured public case study.",
      },
    ],
  }),
  component: TryPage,
});

type UploadedFile = { name: string; sizeBytes: number };

function TryPage() {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [version, setVersion] = useState("OutSystems Developer Cloud (ODC)");
  const [notes, setNotes] = useState("");
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: (): Promise<CaseStudyDraft> =>
      generateCaseStudy({
        data: {
          title,
          role,
          outsystemsVersion: version,
          notes,
          artifactNames: uploads.map((u) => u.name),
        },
      }),
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 15 * 1024 * 1024) {
          setUploadError(`${file.name} exceeds 15 MB.`);
          continue;
        }
        const path = `try/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("project-uploads")
          .upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
        uploaded.push({ name: file.name, sizeBytes: file.size });
      }
      setUploads((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  const canSubmit = title.length > 1 && role.length > 0 && notes.length > 20 && !mutation.isPending;
  const draft = mutation.data;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="eyebrow">Public demo</span>
          <h1 className="mt-3 max-w-[24ch] text-4xl font-medium tracking-tight">
            Turn OutSystems project notes into a case study draft.
          </h1>
          <p className="mt-4 max-w-[56ch] text-ink-muted">
            Paste what you already know about the project, optionally upload screenshots or an
            .oml file, and get a structured draft you could publish under your name. Uploaded
            files stay private.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) mutation.mutate();
            }}
          >
            <Field label="Project title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="e.g. HealthChain: Patient Records Microservices"
                className="w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none ring-0 focus:border-ink"
              />
            </Field>
            <Field label="Your role">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={200}
                placeholder="e.g. Solution Architect"
                className="w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="OutSystems version / environment">
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                maxLength={100}
                className="w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Project notes (screens, entities, integrations, what you did)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={6000}
                rows={10}
                placeholder="Loose notes are fine. Mention the problem, screens, entities, integrations, roles, what you personally built, and any measurable impact."
                className="w-full resize-y rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-ink"
              />
              <span className="mt-1 text-[11px] text-ink-subtle">
                {notes.length} / 6000
              </span>
            </Field>

            <div>
              <span className="eyebrow">Artifacts (optional)</span>
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-hairline bg-surface px-4 py-6 text-sm text-ink-muted transition-colors hover:bg-muted">
                <Upload className="size-4" />
                <span>
                  {isUploading ? "Uploading…" : "Attach screenshots, PDFs, .oml, .oap"}
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {uploadError ? (
                <p className="mt-2 text-xs text-destructive">{uploadError}</p>
              ) : null}
              {uploads.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {uploads.map((u, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-md border border-hairline bg-canvas px-3 py-2 text-sm"
                    >
                      <span className="truncate">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploads((prev) => prev.filter((_, j) => j !== i))}
                        className="text-ink-subtle hover:text-ink"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="size-4" />
              {mutation.isPending ? "Drafting…" : "Generate case study draft"}
            </button>

            {mutation.error ? (
              <p className="text-sm text-destructive">
                {mutation.error instanceof Error ? mutation.error.message : "Generation failed"}
              </p>
            ) : null}
          </form>

          {/* Preview */}
          <div className="rounded-xl border border-hairline bg-surface p-8">
            {!draft && !mutation.isPending ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-center">
                <div className="size-10 rounded-full bg-muted grid place-items-center">
                  <Sparkles className="size-5 text-ink-subtle" />
                </div>
                <p className="max-w-[36ch] text-sm text-ink-muted">
                  Your generated draft will appear here. AI never invents facts — anything it
                  is unsure about is marked as an assumption.
                </p>
              </div>
            ) : null}

            {mutation.isPending ? (
              <p className="text-sm text-ink-muted">
                Drafting a structured case study from your notes…
              </p>
            ) : null}

            {draft ? (
              <article className="space-y-8">
                <div>
                  <span className="eyebrow">Draft overview</span>
                  <p className="mt-3 text-pretty leading-relaxed text-ink">{draft.overview}</p>
                </div>

                {draft.sections.map((s, i) => (
                  <section key={i} className="space-y-3">
                    <h2 className="eyebrow">{s.title}</h2>
                    <p className="whitespace-pre-line text-pretty leading-relaxed text-ink">
                      {s.body}
                    </p>
                  </section>
                ))}

                {draft.suggested_tags.length > 0 ? (
                  <section>
                    <h2 className="eyebrow mb-3">Suggested tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {draft.suggested_tags.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-hairline bg-canvas px-2 py-0.5 text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                {draft.redaction_warnings.length > 0 ? (
                  <section className="rounded-md border border-amber-300/40 bg-amber-50 p-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                      Redaction warnings
                    </h2>
                    <ul className="mt-2 space-y-1 text-sm text-amber-900">
                      {draft.redaction_warnings.map((w, i) => (
                        <li key={i}>· {w}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {draft.assumptions.length > 0 ? (
                  <section>
                    <h2 className="eyebrow mb-2">Assumptions to confirm</h2>
                    <ul className="space-y-1 text-sm text-ink-muted">
                      {draft.assumptions.map((a, i) => (
                        <li key={i}>· {a}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}