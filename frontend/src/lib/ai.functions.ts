import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  title: z.string().min(2).max(200),
  role: z.string().min(1).max(200),
  outsystemsVersion: z.string().max(100).optional().default(""),
  notes: z.string().min(20).max(6000),
  artifactNames: z.array(z.string()).max(20).optional().default([]),
});

export type CaseStudyDraft = {
  overview: string;
  sections: Array<{ title: string; body: string }>;
  suggested_tags: string[];
  redaction_warnings: string[];
  assumptions: string[];
};

export const generateCaseStudy = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<CaseStudyDraft> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const systemPrompt = `You are Outfolio's case-study assistant for OutSystems developers.

Given rough notes about an OutSystems project, produce a structured public case-study draft.

Rules:
- Do NOT invent facts, client names, metrics, integrations, screens, or entities. Use only what the developer supplied.
- If a section cannot be filled honestly, leave the body empty or write "Add detail here".
- Write in a calm, professional tone suitable for recruiters and technical reviewers.
- Flag anything that reads like a sensitive client/patient/customer detail as a redaction warning.
- Prefer plain English over marketing copy. No emojis. No exclamation marks.

Return JSON matching:
{
  "overview": string,
  "sections": [ { "title": string, "body": string } ],
  "suggested_tags": string[],
  "redaction_warnings": string[],
  "assumptions": string[]
}

Use these section titles in this order: "Problem", "Solution", "Screens & Workflows", "Data Model", "Integrations", "My Role", "Business Impact".`;

    const userPrompt = `Project title: ${data.title}
Developer role: ${data.role}
OutSystems version / environment: ${data.outsystemsVersion || "(not specified)"}
Uploaded artifacts (filenames only, contents not read): ${data.artifactNames.join(", ") || "(none)"}

Developer notes:
"""
${data.notes}
"""

Generate the case-study draft now.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) {
      throw new Error("The AI generator is rate-limited right now. Try again in a moment.");
    }
    if (res.status === 402) {
      throw new Error("Lovable AI credits exhausted for this workspace. Add credits to keep generating.");
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: CaseStudyDraft;
    try {
      parsed = JSON.parse(content) as CaseStudyDraft;
    } catch {
      throw new Error("AI response was not valid JSON. Try again with more detail.");
    }
    return {
      overview: parsed.overview ?? "",
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      suggested_tags: Array.isArray(parsed.suggested_tags) ? parsed.suggested_tags : [],
      redaction_warnings: Array.isArray(parsed.redaction_warnings)
        ? parsed.redaction_warnings
        : [],
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
    };
  });