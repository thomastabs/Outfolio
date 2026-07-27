import express, { type Response } from "express";
import { requireAuth, type AuthedRequest } from "../../../../../lib/auth.js";
import { supabaseAdmin } from "../../../../../lib/supabaseClient.js";

const app = express();
app.use(express.json());

const ALLOWED_VISIBILITY = ["public", "private", "unlisted"];

type VisibilityUpdateBody = {
  visibility?: unknown;
  fieldVisibility?: unknown;
};

app.put(
  "/api/v1/users/me/profile/visibility",
  requireAuth,
  async (req: AuthedRequest<unknown, unknown, VisibilityUpdateBody>, res: Response) => {
    const { visibility, fieldVisibility } = req.body ?? {};

    if (typeof visibility !== "string" || !ALLOWED_VISIBILITY.includes(visibility)) {
      console.error(`[profile:visibility] invalid_input: visibility="${String(visibility)}" userId="${req.userId}"`);
      return res.status(400).json({
        error: "invalid_input",
        message: `visibility must be one of: ${ALLOWED_VISIBILITY.join(", ")}.`,
      });
    }

    if (fieldVisibility !== undefined && (typeof fieldVisibility !== "object" || fieldVisibility === null || Array.isArray(fieldVisibility))) {
      return res.status(400).json({ error: "invalid_input", message: "fieldVisibility must be an object." });
    }

    console.log(`[profile:visibility] attempt userId="${req.userId}" visibility="${visibility}"`);

    try {
      const { error } = await supabaseAdmin
        .from("users")
        .update({
          visibility_settings: { visibility, fieldVisibility: fieldVisibility ?? {} },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", req.userId);

      if (error) {
        console.error("[profile:visibility] update failed", error);
        return res.status(500).json({ error: "server_error", message: "Could not update visibility settings." });
      }

      console.log(`[profile:visibility] success userId="${req.userId}"`);
      return res.status(200).json({ success: true, message: "Visibility settings updated." });
    } catch (err) {
      console.error("[profile:visibility] unexpected error", err);
      return res.status(500).json({ error: "server_error", message: "Could not update visibility settings." });
    }
  },
);

export default app;
