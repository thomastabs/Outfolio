export type Artifact = {
  id: string
  name: string
  kind: "screenshot" | "oml" | "oap" | "pdf" | "video" | "link"
  size?: string
}

export type Metric = {
  label: string
  value: string
}

export type Project = {
  slug: string
  title: string
  tagline: string
  cover: string
  developer: string // username
  role: string
  status: "published" | "draft"
  featured?: boolean
  platform: "OutSystems 11" | "OutSystems ODC" | "Mendix" | "Power Apps"
  category: string
  year: string
  duration: string
  teamSize: string
  stack: string[]
  integrations: string[]
  likes: number
  views: number
  summary: string
  problem: string
  approach: string[]
  outcome: string
  metrics: Metric[]
  artifacts: Artifact[]
  gallery: string[]
}

export type Developer = {
  username: string
  name: string
  title: string
  location: string
  available: boolean
  initials: string
  avatarColor: string
  bio: string
  skills: string[]
  certifications: string[]
  experienceYears: number
  followers: number
  links: { label: string; href: string }[]
}

export const developers: Developer[] = [
  {
    username: "maya-okafor",
    name: "Maya Okafor",
    title: "Senior OutSystems Engineer",
    location: "Lisbon, Portugal",
    available: true,
    initials: "MO",
    avatarColor: "var(--chart-1)",
    bio: "Full-stack low-code engineer with 7 years shipping enterprise OutSystems apps for banking and logistics. I care about clean architecture, reactive web, and integrations that don't break at 2am.",
    skills: ["OutSystems 11", "OutSystems ODC", "Reactive Web", "Integration Studio", "REST/SOAP", "SQL Server", "Architecture", "BPT"],
    certifications: ["OutSystems Expert Developer", "Associate Reactive Developer", "AWS Cloud Practitioner"],
    experienceYears: 7,
    followers: 1284,
    links: [
      { label: "Website", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    username: "diego-santos",
    name: "Diego Santos",
    title: "Low-Code Solution Architect",
    location: "São Paulo, Brazil",
    available: false,
    initials: "DS",
    avatarColor: "var(--chart-3)",
    bio: "Solution architect focused on scalable low-code platforms. I lead delivery teams and obsess over reusable components, CI/CD pipelines, and performance tuning.",
    skills: ["OutSystems ODC", "Architecture", "LifeTime", "CI/CD", "Azure", "Performance", "Forge Components"],
    certifications: ["OutSystems Solution Architect", "Expert Reactive Developer"],
    experienceYears: 10,
    followers: 2071,
    links: [
      { label: "Website", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
  {
    username: "priya-nair",
    name: "Priya Nair",
    title: "OutSystems Developer & UX",
    location: "Bengaluru, India",
    available: true,
    initials: "PN",
    avatarColor: "var(--chart-4)",
    bio: "Developer with a design background. I build accessible, polished reactive web and mobile apps and love turning messy requirements into clean flows.",
    skills: ["Reactive Web", "Mobile", "UI/UX", "Accessibility", "CSS", "OutSystems 11", "Silk UI"],
    certifications: ["Associate Reactive Developer", "OutSystems Mobile Developer"],
    experienceYears: 4,
    followers: 643,
    links: [
      { label: "Portfolio", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
]

export const projects: Project[] = [
  {
    slug: "fleetpulse-logistics-portal",
    title: "FleetPulse Logistics Portal",
    tagline: "Real-time fleet tracking and dispatch for a 400-vehicle carrier",
    cover: "/projects/fleetpulse.png",
    developer: "maya-okafor",
    role: "Lead Developer",
    status: "published",
    featured: true,
    platform: "OutSystems 11",
    category: "Logistics",
    year: "2025",
    duration: "5 months",
    teamSize: "4 devs",
    stack: ["Reactive Web", "Integration Studio", "SQL Server", "Timers"],
    integrations: ["Google Maps API", "SAP", "Twilio SMS"],
    likes: 342,
    views: 8900,
    summary:
      "A dispatch and tracking portal that replaced a tangle of spreadsheets and phone calls with a single reactive web app used by dispatchers and drivers every day.",
    problem:
      "The carrier managed 400+ vehicles through email, spreadsheets, and phone calls. Dispatchers had no live view of vehicle status, leading to late deliveries and idle assets.",
    approach: [
      "Modelled the domain in a Core service module and exposed clean REST APIs consumed by the reactive front end.",
      "Integrated the Google Maps API for live positioning and geofencing, refreshed via server-side timers and a lightweight polling strategy.",
      "Built a role-based dispatch board with optimistic UI updates so dispatchers could reassign routes without waiting on round trips.",
      "Added SAP integration through Integration Studio to sync orders and billing automatically.",
    ],
    outcome:
      "Dispatchers now manage the whole fleet from one board. Late deliveries dropped sharply and the client retired three legacy tools.",
    metrics: [
      { label: "Late deliveries", value: "-38%" },
      { label: "Daily active dispatchers", value: "60+" },
      { label: "Legacy tools retired", value: "3" },
      { label: "Avg. dispatch time", value: "-2.4 min" },
    ],
    artifacts: [
      { id: "a1", name: "dispatch-board.png", kind: "screenshot", size: "1.2 MB" },
      { id: "a2", name: "FleetPulse_Core.oml", kind: "oml", size: "8.4 MB" },
      { id: "a3", name: "architecture-overview.pdf", kind: "pdf", size: "640 KB" },
      { id: "a4", name: "demo-walkthrough.mp4", kind: "video", size: "42 MB" },
    ],
    gallery: ["/projects/fleetpulse.png", "/projects/fleetpulse-2.png"],
  },
  {
    slug: "clinicone-patient-intake",
    title: "ClinicOne Patient Intake",
    tagline: "Paperless intake and triage for a network of 12 clinics",
    cover: "/projects/clinicone.png",
    developer: "priya-nair",
    role: "Developer & UX",
    status: "published",
    featured: true,
    platform: "OutSystems 11",
    category: "Healthcare",
    year: "2024",
    duration: "3 months",
    teamSize: "2 devs",
    stack: ["Reactive Web", "Mobile", "Silk UI", "SQL Server"],
    integrations: ["HL7 FHIR", "SendGrid"],
    likes: 218,
    views: 5400,
    summary:
      "An accessible, mobile-first intake experience that lets patients complete forms before arriving and gives nurses a clean triage queue.",
    problem:
      "Patients filled paper forms in the waiting room, creating bottlenecks and transcription errors. Staff wanted a WCAG-compliant digital flow.",
    approach: [
      "Designed a multi-step intake wizard with autosave, working on phones and kiosks alike.",
      "Met WCAG 2.1 AA with keyboard navigation, focus management, and screen-reader-tested components.",
      "Synced records to the EHR through an HL7 FHIR integration layer.",
    ],
    outcome:
      "Check-in time dropped by nearly half and transcription errors were effectively eliminated across all 12 clinics.",
    metrics: [
      { label: "Check-in time", value: "-47%" },
      { label: "Transcription errors", value: "~0" },
      { label: "Clinics live", value: "12" },
      { label: "Accessibility", value: "WCAG AA" },
    ],
    artifacts: [
      { id: "b1", name: "intake-wizard.png", kind: "screenshot", size: "980 KB" },
      { id: "b2", name: "ClinicOne.oap", kind: "oap", size: "12.1 MB" },
      { id: "b3", name: "accessibility-audit.pdf", kind: "pdf", size: "410 KB" },
    ],
    gallery: ["/projects/clinicone.png"],
  },
  {
    slug: "loanflow-credit-origination",
    title: "LoanFlow Credit Origination",
    tagline: "End-to-end loan origination with automated risk scoring",
    cover: "/projects/loanflow.png",
    developer: "diego-santos",
    role: "Solution Architect",
    status: "published",
    featured: true,
    platform: "OutSystems ODC",
    category: "Fintech",
    year: "2025",
    duration: "8 months",
    teamSize: "6 devs",
    stack: ["ODC", "BPT / Workflows", "REST", "Azure"],
    integrations: ["Experian", "DocuSign", "Azure Service Bus"],
    likes: 401,
    views: 11200,
    summary:
      "A scalable origination platform on OutSystems Developer Cloud that automates credit decisions and orchestrates approvals across departments.",
    problem:
      "Manual loan origination took days and involved re-keying data across systems. The bank needed auditable, automated workflows that could scale.",
    approach: [
      "Architected reusable service modules with clear boundaries and a shared component library.",
      "Built approval workflows with BPT-style orchestration and full audit trails.",
      "Integrated Experian for risk scoring and DocuSign for signatures, decoupled via Azure Service Bus.",
      "Set up LifeTime pipelines for automated, gated deployments across environments.",
    ],
    outcome:
      "Origination that used to take days now completes in hours, with every decision fully auditable.",
    metrics: [
      { label: "Time to decision", value: "-72%" },
      { label: "Applications / month", value: "9,000+" },
      { label: "Manual re-keying", value: "eliminated" },
      { label: "Uptime", value: "99.95%" },
    ],
    artifacts: [
      { id: "c1", name: "origination-flow.png", kind: "screenshot", size: "1.4 MB" },
      { id: "c2", name: "solution-architecture.pdf", kind: "pdf", size: "1.1 MB" },
      { id: "c3", name: "LoanFlow-demo.mp4", kind: "video", size: "58 MB" },
      { id: "c4", name: "case-study.link", kind: "link" },
    ],
    gallery: ["/projects/loanflow.png"],
  },
  {
    slug: "shopsense-retail-ops",
    title: "ShopSense Retail Ops",
    tagline: "Store operations app for 200 retail associates",
    cover: "/projects/shopsense.png",
    developer: "maya-okafor",
    role: "Lead Developer",
    status: "published",
    platform: "OutSystems 11",
    category: "Retail",
    year: "2024",
    duration: "4 months",
    teamSize: "3 devs",
    stack: ["Mobile", "Reactive Web", "Offline Sync"],
    integrations: ["SAP", "Firebase Push"],
    likes: 156,
    views: 3900,
    summary:
      "A mobile-first ops app giving store associates task lists, stock lookups, and offline-capable workflows on the shop floor.",
    problem:
      "Associates relied on back-office terminals and radios. Managers had no visibility into daily task completion.",
    approach: [
      "Built an offline-first mobile app with local storage sync for spotty in-store connectivity.",
      "Created a manager dashboard for task assignment and completion tracking.",
      "Integrated SAP for live stock levels and Firebase for push notifications.",
    ],
    outcome:
      "Task completion visibility went from zero to real-time, and stock lookups stopped requiring a trip to the back office.",
    metrics: [
      { label: "Task visibility", value: "Real-time" },
      { label: "Associates", value: "200" },
      { label: "Stock lookup time", value: "-80%" },
    ],
    artifacts: [
      { id: "d1", name: "store-ops.png", kind: "screenshot", size: "1.1 MB" },
      { id: "d2", name: "ShopSense.oml", kind: "oml", size: "6.7 MB" },
    ],
    gallery: ["/projects/shopsense.png"],
  },
  {
    slug: "edutrack-student-portal",
    title: "EduTrack Student Portal",
    tagline: "Enrollment, grades, and scheduling for a university",
    cover: "/projects/edutrack.png",
    developer: "priya-nair",
    role: "Developer",
    status: "published",
    platform: "OutSystems 11",
    category: "Education",
    year: "2023",
    duration: "6 months",
    teamSize: "4 devs",
    stack: ["Reactive Web", "SQL Server", "Charts"],
    integrations: ["SAML SSO", "Stripe"],
    likes: 189,
    views: 4600,
    summary:
      "A self-service portal where students manage enrollment, view grades, and pay fees, replacing several disconnected legacy systems.",
    problem:
      "Students juggled multiple portals for enrollment, grades, and payments, each with a different login and look.",
    approach: [
      "Unified the experience behind SAML single sign-on.",
      "Built reactive dashboards with charts for grades and progress.",
      "Integrated Stripe for fee payments with receipts and history.",
    ],
    outcome:
      "One portal replaced four, and support tickets about logins and payments dropped significantly.",
    metrics: [
      { label: "Portals unified", value: "4 → 1" },
      { label: "Support tickets", value: "-55%" },
      { label: "Active students", value: "18k" },
    ],
    artifacts: [
      { id: "e1", name: "student-dashboard.png", kind: "screenshot", size: "1.0 MB" },
      { id: "e2", name: "EduTrack.oml", kind: "oml", size: "9.2 MB" },
      { id: "e3", name: "overview.pdf", kind: "pdf", size: "520 KB" },
    ],
    gallery: ["/projects/edutrack.png"],
  },
  {
    slug: "assetguard-maintenance",
    title: "AssetGuard Maintenance",
    tagline: "Preventive maintenance and work orders for facilities",
    cover: "/projects/assetguard.png",
    developer: "diego-santos",
    role: "Solution Architect",
    status: "published",
    platform: "OutSystems ODC",
    category: "Field Service",
    year: "2024",
    duration: "5 months",
    teamSize: "5 devs",
    stack: ["ODC", "Mobile", "Workflows", "IoT"],
    integrations: ["Azure IoT Hub", "Power BI"],
    likes: 174,
    views: 4100,
    summary:
      "A maintenance platform that schedules preventive work, dispatches technicians, and feeds equipment telemetry into actionable work orders.",
    problem:
      "Facilities ran reactive maintenance with paper work orders, causing costly unplanned downtime.",
    approach: [
      "Built a scheduling engine for preventive maintenance windows.",
      "Created a technician mobile app for work orders with photo capture.",
      "Ingested equipment telemetry via Azure IoT Hub to trigger condition-based orders.",
    ],
    outcome:
      "Unplanned downtime dropped as maintenance shifted from reactive to predictive.",
    metrics: [
      { label: "Unplanned downtime", value: "-31%" },
      { label: "Work orders / month", value: "2,400" },
      { label: "Technicians", value: "85" },
    ],
    artifacts: [
      { id: "f1", name: "work-order.png", kind: "screenshot", size: "1.3 MB" },
      { id: "f2", name: "AssetGuard.oap", kind: "oap", size: "14.5 MB" },
    ],
    gallery: ["/projects/assetguard.png"],
  },
]

export function getDeveloper(username: string) {
  return developers.find((d) => d.username === username)
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getProjectsByDeveloper(username: string) {
  return projects.filter((p) => p.developer === username)
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured)
}

export const categories = ["All", "Logistics", "Healthcare", "Fintech", "Retail", "Education", "Field Service"]
export const platforms = ["All platforms", "OutSystems 11", "OutSystems ODC", "Mendix", "Power Apps"]
