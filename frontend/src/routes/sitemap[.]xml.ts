import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/developers", changefreq: "weekly", priority: "0.8" },
          { path: "/try", changefreq: "monthly", priority: "0.6" },
          { path: "/u/marcus-arlow", changefreq: "monthly", priority: "0.7" },
          { path: "/u/nadia-okafor", changefreq: "monthly", priority: "0.7" },
          { path: "/u/marcus-arlow/healthchain-patient-records", changefreq: "monthly", priority: "0.7" },
          { path: "/u/marcus-arlow/field-ops-mobile", changefreq: "monthly", priority: "0.6" },
          { path: "/u/nadia-okafor/nexapay-settlement", changefreq: "monthly", priority: "0.6" },
        ];
        const urls = paths
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});