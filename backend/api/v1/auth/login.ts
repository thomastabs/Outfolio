import express, { type Request, type Response } from "express";
import { supabaseAdmin } from "../../../lib/supabaseClient.js";

const app = express();
app.use(express.json());

type LoginBody = {
  username?: unknown;
  password?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

app.post("/api/v1/auth/login", async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
  const { username, password } = req.body ?? {};

  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    console.error("[login] invalid_input: missing or malformed username/password");
    return res.status(400).json({ error: "invalid_input", message: "username and password are required." });
  }

  console.log(`[login] attempt username="${username}"`);

  try {
    const { data: profile, error: lookupError } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("username", username)
      .maybeSingle();

    if (lookupError) {
      console.error("[login] username lookup failed", lookupError);
      return res.status(500).json({ error: "server_error", message: "Login failed. Try again." });
    }

    if (!profile) {
      console.log(`[login] rejected username="${username}": user_not_found`);
      return res.status(404).json({ error: "user_not_found", message: "We couldn't find an account with that username." });
    }

    const { data: session, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (signInError || !session?.session) {
      console.log(`[login] rejected username="${username}": invalid_credentials`);
      return res.status(401).json({ error: "invalid_credentials", message: "Incorrect username or password." });
    }

    console.log(`[login] success username="${username}" userId="${session.user.id}"`);
    return res.status(200).json({ token: session.session.access_token, userId: session.user.id });
  } catch (err) {
    console.error("[login] unexpected error", err);
    return res.status(500).json({ error: "server_error", message: "Login failed. Try again." });
  }
});

export default app;
