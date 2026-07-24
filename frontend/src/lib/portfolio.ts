import { supabase } from "@/integrations/supabase/client";
import avatarMarcus from "@/assets/avatar-marcus.jpg";
import avatarNadia from "@/assets/avatar-nadia.jpg";
import coverHealthchain from "@/assets/cover-healthchain.jpg";
import coverNexapay from "@/assets/cover-nexapay.jpg";
import coverFieldops from "@/assets/cover-fieldops.jpg";

// Local asset overlays for seeded demo rows. We keep DB columns nullable so
// we don't hardcode CDN paths in migrations.
export const AVATAR_OVERRIDES: Record<string, string> = {
  "marcus-arlow": avatarMarcus,
  "nadia-okafor": avatarNadia,
};

export const COVER_OVERRIDES: Record<string, string> = {
  "healthchain-patient-records": coverHealthchain,
  "nexapay-settlement": coverNexapay,
  "field-ops-mobile": coverFieldops,
};

export type Developer = {
  id: string;
  username: string;
  name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  community_url: string | null;
  years_experience: number | null;
  certifications: string[] | null;
};

export type Project = {
  id: string;
  developer_id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url: string | null;
  project_type: string | null;
  outsystems_version: string | null;
  environment_type: string | null;
  role: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  tags: string[] | null;
  published_at: string | null;
};

export type ProjectSection = {
  id: string;
  project_id: string;
  section_type: string;
  title: string;
  body: string;
  sort_order: number;
};

export type Artifact = {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number | null;
  visibility: string;
};

export function coverFor(project: Pick<Project, "slug" | "cover_image_url">): string | null {
  return COVER_OVERRIDES[project.slug] ?? project.cover_image_url ?? null;
}

export function avatarFor(dev: Pick<Developer, "username" | "avatar_url">): string | null {
  return AVATAR_OVERRIDES[dev.username] ?? dev.avatar_url ?? null;
}

export function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return `${fmt(start)} — Present`;
  return "—";
}

export function formatBytes(n: number | null): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fetchDevelopers(): Promise<Developer[]> {
  const { data, error } = await supabase.from("developers").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Developer[];
}

export async function fetchDeveloperByUsername(username: string) {
  const { data: developer, error } = await supabase
    .from("developers")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!developer) return null;
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("developer_id", developer.id)
    .order("start_date", { ascending: false });
  return { developer: developer as Developer, projects: (projects ?? []) as Project[] };
}

export async function fetchProject(username: string, slug: string) {
  const { data: developer } = await supabase
    .from("developers")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!developer) return null;
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("developer_id", developer.id)
    .eq("slug", slug)
    .maybeSingle();
  if (!project) return null;
  const [{ data: sections }, { data: artifacts }] = await Promise.all([
    supabase
      .from("project_sections")
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order"),
    supabase.from("artifacts").select("*").eq("project_id", project.id),
  ]);
  return {
    developer: developer as Developer,
    project: project as Project,
    sections: (sections ?? []) as ProjectSection[],
    artifacts: (artifacts ?? []) as Artifact[],
  };
}

export async function fetchFeaturedProjects(): Promise<
  Array<Project & { developer: Developer }>
> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, developer:developers(*)")
    .order("start_date", { ascending: false })
    .limit(6);
  if (error) throw error;
  return (data ?? []) as Array<Project & { developer: Developer }>;
}