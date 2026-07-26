import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RegistrationForm } from "@/components/auth/RegistrationForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Set up your Outfolio account to start publishing case studies.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
