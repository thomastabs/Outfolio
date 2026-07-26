"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X } from "lucide-react"

export type LinkEntry = { label: string; url: string }

export type ProfileFormData = {
  name: string
  bio: string
  experienceYears: number | null
  certifications: string[]
  links: LinkEntry[]
}

type FieldErrors = {
  name?: string
  experienceYears?: string
  links?: string
  form?: string
}

type ProfileEditFormProps = {
  initialValues: ProfileFormData
  onSave?: (data: ProfileFormData) => void | Promise<void>
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function ProfileEditForm({ initialValues, onSave }: ProfileEditFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialValues.name)
  const [bio, setBio] = useState(initialValues.bio)
  const [experienceYears, setExperienceYears] = useState(
    initialValues.experienceYears != null ? String(initialValues.experienceYears) : "",
  )
  const [certifications, setCertifications] = useState<string[]>(initialValues.certifications)
  const [certInput, setCertInput] = useState("")
  const [links, setLinks] = useState<LinkEntry[]>(initialValues.links)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const addCertification = () => {
    const v = certInput.trim()
    if (v && !certifications.includes(v)) setCertifications([...certifications, v])
    setCertInput("")
  }

  const addLink = () => setLinks([...links, { label: "", url: "" }])
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index))
  const updateLink = (index: number, patch: Partial<LinkEntry>) =>
    setLinks(links.map((l, i) => (i === index ? { ...l, ...patch } : l)))

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = "Name is required."

    if (experienceYears.trim() && Number.isNaN(Number(experienceYears))) {
      next.experienceYears = "Enter a number."
    }

    const filledLinks = links.filter((l) => l.url.trim().length > 0)
    if (filledLinks.some((l) => !isValidUrl(l.url.trim()))) {
      next.links = "Enter valid URLs for all links."
    }

    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const data: ProfileFormData = {
      name: name.trim(),
      bio: bio.trim(),
      experienceYears: experienceYears.trim() ? Number(experienceYears) : null,
      certifications,
      links: links.filter((l) => l.url.trim().length > 0).map((l) => ({ label: l.label.trim(), url: l.url.trim() })),
    }

    setSubmitting(true)
    setErrors({})
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))

      if (res.status === 200) {
        await onSave?.(data)
        // Server component (app/profile/page.tsx) needs to re-fetch to
        // reflect the change; it can't receive a callback prop from us
        // since the page stays a server component (same reasoning as
        // LoginForm's own redirect).
        router.refresh()
        return
      }
      if (res.status === 400) {
        setErrors({ name: body.message ?? "Name is required." })
        return
      }
      if (res.status === 422) {
        setErrors({ links: body.message ?? "Enter valid URLs for all links." })
        return
      }
      setErrors({ form: body.message ?? "Something went wrong. Try again." })
    } catch {
      setErrors({ form: "Something went wrong. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-xl border border-border bg-card p-6">
      {errors.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceYears">OutSystems experience (years)</Label>
        <Input
          id="experienceYears"
          inputMode="numeric"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          aria-invalid={!!errors.experienceYears}
          aria-describedby={errors.experienceYears ? "experienceYears-error" : undefined}
        />
        {errors.experienceYears && (
          <p id="experienceYears-error" role="alert" className="text-xs text-destructive">
            {errors.experienceYears}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <div className="flex gap-2">
          <Input
            id="certifications"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault()
                addCertification()
              }
            }}
            placeholder="e.g. OutSystems Expert Developer"
          />
          <Button type="button" variant="outline" onClick={addCertification}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {certifications.map((c) => (
              <Badge key={c} variant="secondary" className="gap-1 font-normal">
                {c}
                <button
                  type="button"
                  onClick={() => setCertifications(certifications.filter((x) => x !== c))}
                  aria-label={`Remove ${c}`}
                  className="rounded-full transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Links</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add link
          </Button>
        </div>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={link.label}
              onChange={(e) => updateLink(i, { label: e.target.value })}
              placeholder="Label (e.g. LinkedIn)"
              className="w-1/3"
            />
            <Input
              value={link.url}
              onChange={(e) => updateLink(i, { url: e.target.value })}
              placeholder="https://..."
              aria-invalid={!!errors.links}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)} aria-label="Remove link">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {errors.links && (
          <p role="alert" className="text-xs text-destructive">
            {errors.links}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  )
}
