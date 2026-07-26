import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "./supabaseClient.js";

export interface AuthedRequest<P = unknown, ResBody = unknown, ReqBody = unknown>
  extends Request<P, ResBody, ReqBody> {
  userId?: string;
}

// Verifies the Bearer JWT against Supabase Auth and attaches the resulting
// user id to the request. Shared by any route under backend/api/v1 that
// requires auth:bearer per the endpoint spec.
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized", message: "Missing or invalid authorization header." });
  }

  const token = authHeader.slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: "unauthorized", message: "Invalid or expired token." });
  }

  req.userId = data.user.id;
  next();
}
