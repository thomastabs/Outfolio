"use client"

import { useRef, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { platforms, categories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Check,
  UploadCloud,
  FileImage,
  FileBox,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  Rocket,
  Plus,
} from "lucide-react"

type StagedFile = { name: string; size: string; kind: "screenshot" | "oml" | "pdf" }

const steps = ["Basics", "Story", "Tech & tags", "Artifacts", "Review"] as const

const sampleFiles: StagedFile[] = [
  { name: "dispatch-board.png", size: "1.2 MB", kind: "screenshot" },
  { name: "architecture.pdf", size: "640 KB", kind: "pdf" },
]

const fileIcon = { screenshot: FileImage, oml: FileBox, pdf: FileText }

export default function NewProjectPage() {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState("")
  const [tagline, setTagline] = useState("")
  const [platform, setPlatform] = useState("OutSystems 11")
  const [category, setCategory] = useState("Logistics")
  const [problem, setProblem] = useState("")
  const [approach, setApproach] = useState("")
  const [outcome, setOutcome] = useState("")
  const [stack, setStack] = useState<string[]>(["Reactive Web"])
  const [stackInput, setStackInput] = useState("")
  const [files, setFiles] = useState<StagedFile[]>(sampleFiles)
  const inputRef = useRef<HTMLInputElement>(null)

  const addStack = () => {
    const v = stackInput.trim()
    if (v && !stack.includes(v)) setStack([...stack, v])
    setStackInput("")
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).map((f) => {
      const isImg = f.type.startsWith("image")
      const isPdf = f.type.includes("pdf")
      return {
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        kind: isImg ? "screenshot" : isPdf ? "pdf" : "oml",
      } as StagedFile
    })
    setFiles((prev) => [...prev, ...picked])
    e.target.value = ""
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create a project</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn one of your apps into a case study. This is a prototype, so nothing is saved.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full font-normal">
              Draft
            </Badge>
          </div>

          {/* Stepper */}
          <ol className="mt-8 flex items-center gap-2">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className="flex items-center gap-2 text-left"
                  aria-current={i === step ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                      i < step && "border-primary bg-primary text-primary-foreground",
                      i === step && "border-primary text-primary",
                      i > step && "border-border text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm sm:inline",
                      i === step ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s}
                  </span>
                </button>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
              </li>
            ))}
          </ol>

          {/* Panel */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            {step === 0 && (
              <div className="space-y-5">
                <Field label="Project title" htmlFor="title">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FleetPulse Logistics Portal"
                  />
                </Field>
                <Field label="Tagline" htmlFor="tagline" hint="One line that sums up what you built.">
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Real-time fleet tracking and dispatch for a 400-vehicle carrier"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Platform" htmlFor="platform">
                    <Select value={platform} onValueChange={(value) => setPlatform(value ?? "OutSystems 11")}>
                      <SelectTrigger id="platform">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms
                          .filter((p) => p !== "All platforms")
                          .map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Category" htmlFor="category">
                    <Select value={category} onValueChange={(value) => setCategory(value ?? "Logistics")}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <Field label="The problem" htmlFor="problem" hint="What situation or pain point did the app address?">
                  <Textarea
                    id="problem"
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Describe the business problem and constraints..."
                  />
                </Field>
                <Field label="Your approach" htmlFor="approach" hint="How did you design and build the solution?">
                  <Textarea
                    id="approach"
                    rows={5}
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    placeholder="Architecture decisions, key modules, integrations, tricky parts..."
                  />
                </Field>
                <Field label="The outcome" htmlFor="outcome" hint="What changed? Include numbers where you can.">
                  <Textarea
                    id="outcome"
                    rows={4}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Results, adoption, metrics, impact..."
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Field label="Tech stack" htmlFor="stack" hint="Add the OutSystems capabilities and technologies you used.">
                  <div className="flex gap-2">
                    <Input
                      id="stack"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                          e.preventDefault()
                          addStack()
                        }
                      }}
                      placeholder="e.g. Integration Studio"
                    />
                    <Button type="button" variant="outline" onClick={addStack}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stack.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1 font-normal">
                        {s}
                        <button
                          onClick={() => setStack(stack.filter((x) => x !== s))}
                          aria-label={`Remove ${s}`}
                          className="rounded-full transition-colors hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/50 px-6 py-12 text-center transition-colors hover:border-primary/60 hover:bg-accent"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UploadCloud className="h-6 w-6" />
                    </span>
                    <span className="text-sm font-medium">Drag files here or click to upload</span>
                    <span className="text-xs text-muted-foreground">
                      Screenshots, .oml / .oap modules, PDFs, and demo videos up to 100 MB
                    </span>
                  </button>
                  <input ref={inputRef} type="file" multiple className="sr-only" onChange={onPick} />
                </div>

                {files.length > 0 && (
                  <ul className="space-y-2">
                    {files.map((f, i) => {
                      const Icon = fileIcon[f.kind]
                      return (
                        <li
                          key={`${f.name}-${i}`}
                          className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{f.name}</div>
                            <div className="text-xs text-muted-foreground">{f.size} · Uploaded</div>
                          </div>
                          <button
                            onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                            aria-label={`Remove ${f.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="rounded-lg border border-border bg-background/50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{platform}</Badge>
                    <Badge variant="outline" className="rounded-full font-normal">
                      {category}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">
                    {title || "Untitled project"}
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    {tagline || "Add a tagline to describe your project."}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <ReviewItem label="Stack" value={stack.join(", ") || "—"} />
                    <ReviewItem label="Artifacts" value={`${files.length} file${files.length === 1 ? "" : "s"}`} />
                    <ReviewItem label="Problem" value={problem ? "Added" : "Empty"} />
                    <ReviewItem label="Outcome" value={outcome ? "Added" : "Empty"} />
                  </dl>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                  <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    This is a UI prototype. Publishing is mocked and won&apos;t save your project yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button>
                <Rocket className="mr-1 h-4 w-4" /> Publish project
              </Button>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate font-medium">{value}</dd>
    </div>
  )
}
