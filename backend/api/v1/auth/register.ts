import express, { type Request, type Response } from "express";
import { supabaseAdmin } from "../../../lib/supabaseClient.js";

const app = express();
app.use(express.json());

type RegisterBody = {
  username?: unknown;
  email?: unknown;
  password?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function looksLikeInvalidEmailError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("email") && (lower.includes("invalid") || lower.includes("unable to validate"));
}

app.post("/api/v1/auth/register", async (req: Request<unknown, unknown, RegisterBody>, res: Response) => {
  const { username, email, password } = req.body ?? {};

  if (!isNonEmptyString(username) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
    console.error("[register] invalid_input: missing or malformed username/email/password");
    return res.status(400).json({ error: "invalid_input", message: "username, email, and password are required." });
  }

  console.log(`[register] attempt username="${username}" email="${email}"`);

  try {
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("users")
      .select("user_id")
      .eq("username", username)
      .maybeSingle();

    if (lookupError) {
      console.error("[register] username lookup failed", lookupError);
      return res.status(500).json({ error: "server_error", message: "Registration failed. Try again." });
    }

    if (existing) {
      console.log(`[register] rejected username="${username}": username_taken`);
      return res.status(409).json({ error: "username_taken", message: "This username is already taken." });
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (createError || !created?.user) {
      if (createError && looksLikeInvalidEmailError(createError.message)) {
        console.log(`[register] rejected email="${email}": invalid_email`);
        return res.status(422).json({ error: "invalid_email", message: "Enter a valid email address." });
      }
      console.error("[register] Supabase Auth createUser failed", createError);
      return res.status(500).json({ error: "server_error", message: "Registration failed. Try again." });
    }

    const userId = created.user.id;

    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({ user_id: userId, username, email });

    if (insertError) {
      console.error("[register] profile insert failed, rolling back auth user", insertError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: "server_error", message: "Registration failed. Try again." });
    }

    console.log(`[register] success userId="${userId}" username="${username}"`);
    return res.status(200).json({ userId, message: "Account created and ready to use." });
  } catch (err) {
    console.error("[register] unexpected error", err);
    return res.status(500).json({ error: "server_error", message: "Registration failed. Try again." });
  }
});

export default app;
