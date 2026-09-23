import type { MetadataRoute } from "next";
import { BRANCHES, SITE } from "@/lib/data";

// Static export requires a fully static sitemap.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...BRANCHES.map((branch) => ({
      url: `${SITE.url}/branches/${branch.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
