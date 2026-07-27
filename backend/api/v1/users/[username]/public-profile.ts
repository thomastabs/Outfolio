import express, { type Request, type Response } from "express";
import { supabaseAdmin } from "../../../../lib/supabaseClient.js";

const app = express();

const PROFILE_COLUMNS = "username,name,bio,experience_years,certifications,links,visibility_settings";

// Fields eligible for per-field visibility toggles (EP-5's fieldVisibility,
// EP-6's fieldsVisible). Visible by default unless explicitly set "private".
const TOGGLEABLE_FIELDS = ["name", "bio", "experienceYears", "certifications", "links"] as const;
type ToggleableField = (typeof TOGGLEABLE_FIELDS)[number];

app.get("/api/v1/users/:username/public-profile", async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(PROFILE_COLUMNS)
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("[public-profile] lookup failed", error);
      return res.status(500).json({ error: "server_error", message: "Could not load profile." });
    }

    if (!data) {
      return res.status(404).json({ error: "not_found", message: "No developer found with that username." });
    }

    const settings = (data.visibility_settings ?? {}) as { visibility?: string; fieldVisibility?: Record<string, string> };
    // No visibility_settings saved yet (never called EP-5) defaults to public -
    // Outfolio is a public-portfolio product; an unconfigured profile shouldn't
    // be unreachable by default.
    const visibility = settings.visibility ?? "public";
    const fieldVisibility = settings.fieldVisibility ?? {};

    if (visibility === "private") {
      return res.status(403).json({ error: "profile_private", message: "This profile is not available." });
    }

    const fieldsVisible: Record<ToggleableField, boolean> = TOGGLEABLE_FIELDS.reduce(
      (acc, field) => ({ ...acc, [field]: fieldVisibility[field] !== "private" }),
      {} as Record<ToggleableField, boolean>,
    );

    const body: Record<string, unknown> = { username: data.username, visibility, fieldsVisible };
    if (fieldsVisible.name) body.name = data.name;
    if (fieldsVisible.bio) body.bio = data.bio;
    if (fieldsVisible.experienceYears) body.experienceYears = data.experience_years;
    if (fieldsVisible.certifications) body.certifications = data.certifications ?? [];
    if (fieldsVisible.links) body.links = data.links ?? [];

    return res.status(200).json(body);
  } catch (err) {
    console.error("[public-profile] unexpected error", err);
    return res.status(500).json({ error: "server_error", message: "Could not load profile." });
  }
});

export default app;
