
-- Developers (public profiles)
CREATE TABLE public.developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  community_url TEXT,
  years_experience INT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.developers TO anon, authenticated;
GRANT ALL ON public.developers TO service_role;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Developers are publicly readable" ON public.developers FOR SELECT USING (true);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image_url TEXT,
  project_type TEXT,
  outsystems_version TEXT,
  environment_type TEXT,
  role TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  anonymized BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'production',
  start_date DATE,
  end_date DATE,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(developer_id, slug)
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects are readable" ON public.projects FOR SELECT USING (visibility = 'public');

-- Project sections (ordered blocks of prose)
CREATE TABLE public.project_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.project_sections TO anon, authenticated;
GRANT ALL ON public.project_sections TO service_role;
ALTER TABLE public.project_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections of public projects are readable" ON public.project_sections FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.visibility = 'public'));

-- Media assets (screenshots, diagrams)
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'screenshot',
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media of public projects is readable" ON public.media_assets FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.visibility = 'public'));

-- Artifacts (uploaded files, private by default — only metadata is public)
CREATE TABLE public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  size_bytes BIGINT,
  visibility TEXT NOT NULL DEFAULT 'private',
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artifacts TO anon, authenticated;
GRANT ALL ON public.artifacts TO service_role;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artifact metadata for public projects is readable" ON public.artifacts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.visibility = 'public'));

-- Seed developers
INSERT INTO public.developers (id, username, name, headline, bio, location, years_experience, linkedin_url, community_url, certifications) VALUES
  ('11111111-1111-1111-1111-111111111111', 'marcus-arlow', 'Marcus Arlow', 'Senior OutSystems Delivery Lead',
   'Ten years shipping enterprise OutSystems in healthcare and public sector. I care about clean architecture and the humans on the other end of the screen.',
   'Lisbon, PT', 10, 'https://linkedin.com/in/example', 'https://community.outsystems.com/', ARRAY['OutSystems Expert Traditional Web','OutSystems ODC Reactive','Certified Solution Architect']),
  ('22222222-2222-2222-2222-222222222222', 'nadia-okafor', 'Nadia Okafor', 'Reactive Web Developer • ODC',
   'Building financial and logistics apps on OutSystems. Comfortable in Service Studio, C# extensions, and the messy middle where integrations live.',
   'Amsterdam, NL', 6, 'https://linkedin.com/in/example', 'https://community.outsystems.com/', ARRAY['OutSystems Associate Reactive','ODC Developer']);

-- Seed projects
INSERT INTO public.projects (id, developer_id, slug, title, summary, project_type, outsystems_version, environment_type, role, status, start_date, end_date, tags) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'healthchain-patient-records',
   'HealthChain: Patient Records Microservices',
   'A multi-tenant patient management portal replacing legacy Oracle systems with a 12-microservice architecture on OutSystems Developer Cloud (ODC).',
   'Enterprise Reactive Web','OutSystems Developer Cloud (ODC)','Production','Solution Architect','production','2023-10-01','2024-03-01',
   ARRAY['ODC','REST API','FHIR','Healthcare','Multi-tenant']),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', 'field-ops-mobile',
   'FieldOps: Utility Inspection Mobile App',
   'Offline-first mobile app for utility inspectors, syncing 40k inspections per week from remote sites into SAP.',
   'Mobile App','OutSystems 11','Production','Tech Lead','production','2022-03-01','2022-11-01',
   ARRAY['Mobile','Offline','SAP','Utilities']),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '22222222-2222-2222-2222-222222222222', 'nexapay-settlement',
   'NexaPay: Multi-Currency Settlement Engine',
   'Reactive web app that settles cross-border payments across 40+ currencies, backed by BPT orchestration and an ACID-safe ledger.',
   'Enterprise Reactive Web','OutSystems 11','Production','Lead Developer','production','2024-01-01','2024-05-01',
   ARRAY['FinTech','BPT','REST','SAP','Reactive']);

-- Seed sections for HealthChain
INSERT INTO public.project_sections (project_id, section_type, title, body, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','problem','The Problem',
   'The regional health provider struggled with data silos across five clinics. Patient onboarding took 45 minutes on average due to manual entry in multiple disconnected systems, leading to high error rates and frustrated practitioners. Audit trails were incomplete and HL7 data flowed through fragile nightly batch jobs.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','solution','The Solution',
   'We architected a unified reactive portal on ODC organised around 12 domain microservices (Patient, Encounter, Consent, Billing, Referral, Scheduling, etc.). Core entities were centralised behind service actions, and a synchronous FHIR gateway replaced the batch jobs. Patient onboarding dropped from 45 to 8 minutes.', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','screens','Screens & Workflows',
   'Twelve reactive web screens including a triage dashboard, patient timeline, consent capture flow, referral wizard and admin console. A BPT process orchestrates the consent lifecycle across three approving roles.', 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','data_model','Data Model',
   'Twenty-eight entities across the twelve service modules. Patient is the aggregate root; Encounter, Observation, Consent and Referral hang off it. UUID identity is used end-to-end so that records can be reconciled against external FHIR systems.', 4),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','integrations','Integrations',
   'HL7 FHIR REST API (OAuth 2.0), a legacy Oracle SQL gateway exposed as external entities, and a SAML 2.0 identity provider federated with the hospital SSO.', 5),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','role','My Role',
   'Solution architect and lead developer. Owned the module decomposition, the FHIR gateway design, the BPT consent workflow, and coached three junior developers through their first ODC delivery.', 6),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','impact','Business Impact',
   '82% reduction in manual data entry time across clinics. 99.9% uptime achieved through ODC''s auto-scaling. Roughly EUR 420k saved annually in support and rework costs.', 7);

-- Seed sections for NexaPay
INSERT INTO public.project_sections (project_id, section_type, title, body, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','problem','The Problem',
   'The legacy settlement engine suffered from database contention at peak hours, producing a 15% transaction failure rate and forcing an operations team of nine to reconcile trades by hand every morning.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','solution','The Solution',
   'Implemented an asynchronous event-driven architecture using OutSystems BPT and Light BPT to offload heavy settlement processing from the user thread, with a compensating ledger for ACID safety across currencies.', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','integrations','Integrations',
   'SAP S/4HANA over OData, AWS SQS via REST, and Stripe Connect webhooks for card settlements. All external calls are routed through a resilience layer with retry and circuit-break policies.', 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','role','My Role',
   'Lead developer. Designed the ledger, implemented the BPT flows and the resilience layer, and paired daily with a junior developer through the entire delivery.', 4),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','impact','Business Impact',
   'Failure rate dropped from 15% to under 0.4%. Manual reconciliation shrank from nine people to two. Ops now processes USD 4M in daily volume without pager alerts.', 5);

-- Seed sections for FieldOps
INSERT INTO public.project_sections (project_id, section_type, title, body, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','problem','The Problem',
   'Field inspectors were driving 200 km round-trips to sync paper checklists into SAP. Data quality was poor and inspections were commonly lost.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','solution','The Solution',
   'Offline-first OutSystems mobile app with local SQLite storage, background sync when connectivity returned, and a conflict-resolution UI for supervisors. SAP integration used the OutSystems SAP connector with a hardened idempotency layer.', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','impact','Business Impact',
   '40k inspections per week now sync automatically. Field time recovered per inspector: roughly 6 hours/week. Data quality issues down 71%.', 3);

-- Seed artifacts
INSERT INTO public.artifacts (project_id, file_name, file_type, size_bytes, visibility) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','Architecture_Diagram.pdf','application/pdf',482301,'private'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','ODC_Deployment_Manifest.oml','application/octet-stream',1204521,'private'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','Data_Model_ERD.pdf','application/pdf',311204,'public'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','NexaPay_Ledger_Design.pdf','application/pdf',528211,'private'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','Settlement_Flow.oml','application/octet-stream',1885012,'private'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','FieldOps_Overview.pdf','application/pdf',224100,'public');
