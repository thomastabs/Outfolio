"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = {
  username?: string
  email?: string
  password?: string
  form?: string
}

export function RegistrationForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!username.trim()) next.username = "Username is required."
    if (!email.trim()) next.email = "Email is required."
    else if (!EMAIL_PATTERN.test(email)) next.email = "Enter a valid email address."
    if (!password) next.password = "Password is required."
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })
      const body = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setSuccess(true)
        return
      }
      if (res.status === 409) {
        setErrors({ username: body.message ?? "This username is already taken." })
        return
      }
      if (res.status === 422) {
        setErrors({ email: body.message ?? "Enter a valid email address." })
        return
      }
      setErrors({ form: body.message ?? "Something went wrong. Try again." })
    } catch {
      setErrors({ form: "Something went wrong. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">Account created</h2>
        <p className="text-sm text-muted-foreground">Your account is ready to use.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-border bg-card p-6">
      {errors.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p id="username-error" role="alert" className="text-xs text-destructive">
            {errors.username}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-xs text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  )
}
