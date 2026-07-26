import express, { type Response } from "express";
import { requireAuth, type AuthedRequest } from "../../../../lib/auth.js";
import { supabaseAdmin } from "../../../../lib/supabaseClient.js";

const app = express();
app.use(express.json());

const PROFILE_COLUMNS = "username,name,bio,experience_years,certifications,links,visibility_settings";

type LinkEntry = { label?: unknown; url?: unknown };

type ProfileUpdateBody = {
  name?: unknown;
  bio?: unknown;
  experienceYears?: unknown;
  certifications?: unknown;
  links?: unknown;
};

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

app.get("/api/v1/users/me/profile", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(PROFILE_COLUMNS)
      .eq("user_id", req.userId)
      .maybeSingle();

    if (error || !data) {
      console.error("[profile:get] profile lookup failed", error ?? "no row for user_id");
      return res.status(500).json({ error: "server_error", message: "Could not load profile." });
    }

    return res.status(200).json({
      username: data.username,
      name: data.name,
      bio: data.bio,
      experienceYears: data.experience_years,
      certifications: data.certifications ?? [],
      links: data.links ?? [],
      visibilitySettings: data.visibility_settings ?? {},
    });
  } catch (err) {
    console.error("[profile:get] unexpected error", err);
    return res.status(500).json({ error: "server_error", message: "Could not load profile." });
  }
});

app.put("/api/v1/users/me/profile", requireAuth, async (req: AuthedRequest<unknown, unknown, ProfileUpdateBody>, res: Response) => {
  const { name, bio, experienceYears, certifications, links } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    console.error(`[profile:put] invalid_input: missing name userId="${req.userId}"`);
    return res.status(400).json({ error: "invalid_input", message: "Name is required." });
  }

  if (experienceYears !== undefined && typeof experienceYears !== "number") {
    return res.status(400).json({ error: "invalid_input", message: "experienceYears must be a number." });
  }

  if (certifications !== undefined && !(Array.isArray(certifications) && certifications.every((c) => typeof c === "string"))) {
    return res.status(400).json({ error: "invalid_input", message: "certifications must be an array of strings." });
  }

  if (links !== undefined) {
    if (!Array.isArray(links)) {
      return res.status(400).json({ error: "invalid_input", message: "links must be an array." });
    }
    const invalidEntry = (links as LinkEntry[]).find(
      (entry) => typeof entry.url !== "string" || !isValidUrl(entry.url),
    );
    if (invalidEntry) {
      console.log(`[profile:put] rejected userId="${req.userId}": invalid_url`);
      return res.status(422).json({ error: "validation_error", message: "Enter valid URLs for all links." });
    }
  }

  console.log(`[profile:put] attempt userId="${req.userId}"`);

  try {
    const updates: Record<string, unknown> = { name, updated_at: new Date().toISOString() };
    if (bio !== undefined) updates.bio = bio;
    if (experienceYears !== undefined) updates.experience_years = experienceYears;
    if (certifications !== undefined) updates.certifications = certifications;
    if (links !== undefined) updates.links = links;

    const { error } = await supabaseAdmin.from("users").update(updates).eq("user_id", req.userId);

    if (error) {
      console.error("[profile:put] update failed", error);
      return res.status(500).json({ error: "server_error", message: "Could not update profile." });
    }

    console.log(`[profile:put] success userId="${req.userId}"`);
    return res.status(200).json({ success: true, message: "Profile updated." });
  } catch (err) {
    console.error("[profile:put] unexpected error", err);
    return res.status(500).json({ error: "server_error", message: "Could not update profile." });
  }
});

export default app;
