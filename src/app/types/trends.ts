import { z } from "zod";

// Define Zod schemas
export const linkSchema = z.object({
  linkId: z.string(),
  title: z.string(),
  number_of_upvotes: z.number(),
  number_of_comments: z.number(),
  website_domain: z.string(),
  topics: z.array(z.string()),
  companies_mentioned: z.array(z.string()),
  linkHref: z.string()
});

export const trendSchema = z.object({
  trend_viral_score: z.string(),
  trend_title: z.string(),
  trend_sources: z.array(z.string()),
  trend_overview: z.string(),
  trend_suggestions: z.array(z.string())
});

export const trendsResponseSchema = z.array(trendSchema);

export const trendsDataSchema = z.object({
  timestamp: z.string(),
  category: z.string(),
  results: z.object({
    trends: z.array(trendSchema),
    linksData: z.array(linkSchema)
  })
});

// Derive TypeScript types from Zod schemas
export type Link = z.infer<typeof linkSchema>;
export type Trend = z.infer<typeof trendSchema>;
export type TrendsData = z.infer<typeof trendsDataSchema>; 