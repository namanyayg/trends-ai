import { NextResponse } from 'next/server';
import FirecrawlApp from "@mendable/firecrawl-js";
import { put, list } from '@vercel/blob';
import { z } from "zod";

// Define the schema for trend data
const linkSchema = z.object({
  linkId: z.string(),
  title: z.string(),
  number_of_upvotes: z.number(),
  number_of_comments: z.number(),
  website_domain: z.string(),
  topics: z.array(z.string()),
  companies_mentioned: z.array(z.string()),
  linkHref: z.string().optional()
});

const trendSchema = z.object({
  trend_viral_score: z.string(),
  trend_title: z.string(),
  trend_sources: z.array(z.string()),
  trend_hooks: z.array(z.string()),
  trend_narratives: z.array(z.string())
});

const schema = z.object({
  links: z.array(linkSchema),
  trends: z.array(trendSchema),
  future_trends: z.array(z.string())
});

const CATEGORIES = {
  technology: {
    url: "https://redlib.catsarch.com/r/technology/top?t=day",
    name: "Technology"
  },
  cryptocurrency: {
    url: "https://redlib.catsarch.com/r/cryptocurrency/top?t=day",
    name: "Cryptocurrency"
  },
  finance: {
    url: "https://redlib.catsarch.com/r/wallstreetbets/top?t=day",
    name: "Finance"
  }
};

const SYSTEM_PROMPT = `You are a smart AI doing trend analysis based on all given links, think very carefully to identify the major trends and give valuable information to help the user prepare new content that has high chances of going viral on Twitter with your trend analysis.

For each link, generate a linkId by taking the first 6 characters of the title (lowercase, alphanumeric only) plus a random 2-digit number. For example "nvidia announces" might become "nvidia23". Also extract the linkHref from the post's URL if available.

Focus only on substantial news, technical developments, and meaningful stories. Avoid any memes, image-based content, or purely entertainment posts.

Ensure that the Trend hooks are written in Twitter style and are emotional, attention grabbing, and focus on the actual news/developments. Avoid exclamation marks.

For Narratives, give array of at least 3 highly descriptive and informative idea of the narrative that's happening that it could be useful to create Twitter threads from.

In "trend_sources", use the linkIds of the articles that contributed to identifying this trend, ensuring clear attribution and traceability.

Give an integer trend_viral_score out of 10 on the viral chances of this.

Only get the first ~10-15 titles, more are not needed.`;

export async function POST() {
  try {
    // Process each category
    for (const [category, config] of Object.entries(CATEGORIES)) {
      console.log(`Extracting category "${category}"`);
      // Check existing blob first
      const { blobs } = await list();
      const trendsBlob = blobs.find(blob => blob.pathname === `trends-${category}.json`);

      if (trendsBlob) {
        console.log(`Found existing blob for ${category}`);
        const response = await fetch(trendsBlob.url);
        const existingData = await response.json();
        
        // Check if last update was less than 1 hour ago
        const lastUpdateTime = new Date(existingData.timestamp);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        if (lastUpdateTime > oneHourAgo) {
          console.log(`Skipping ${category} - last update was less than 1 hour ago`);
          continue;
        }
      }

      // Initialize Firecrawl
      const app = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY || ''
      });

      console.log(`Scraping ${config.url}`);
      // Extract trends using Firecrawl
      const scrapeResult = await app.scrapeUrl(config.url, {
        formats: ["extract"],
        extract: { 
          schema: schema,
          systemPrompt: SYSTEM_PROMPT
        }
      });

      if (!scrapeResult.success) {
        console.error(`Failed to scrape ${category}:`, scrapeResult.error);
        continue;
      }

      const blobData = {
        timestamp: new Date().toISOString(),
        category: config.name,
        results: scrapeResult.extract
      };

      await put(`trends-${category}.json`, JSON.stringify(blobData), {
        access: 'public',
        contentType: 'application/json'
      });

      console.log(`Successfully processed ${category}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'All categories processed successfully'
    });

  } catch (error) {
    console.error('Error extracting trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to extract trends' },
      { status: 500 }
    );
  }
} 