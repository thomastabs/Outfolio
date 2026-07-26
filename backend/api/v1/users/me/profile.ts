import express, { type Response } from "express";
import { requireAuth, type AuthedRequest } from "../../../../lib/auth.js";
import { supabaseAdmin } from "../../../../lib/supabaseClient.js";

const app = express();
app.use(express.json());

const PROFILE_COLUMNS = "username,name,bio,experience_years,certifications,links,visibility_settings";

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

export default app;
