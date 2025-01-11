import { NextResponse } from 'next/server';
import FirecrawlApp from "@mendable/firecrawl-js";
import { put, list } from '@vercel/blob';
import { z } from "zod";

// Define the schema for trend data
const linkSchema = z.object({
  title: z.string(),
  number_of_upvotes: z.number(),
  number_of_comments: z.number(),
  website_domain: z.string(),
  topics: z.array(z.string()),
  companies_mentioned: z.array(z.string())
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

const FIRECRAWL_URL = "https://redlib.catsarch.com/r/technology/top?t=day";
const SYSTEM_PROMPT = `You are a smart AI doing trend analysis based on all given links, think very carefully to identify the major trends and give valuable information to help the user prepare new content that has high chances of going viral on Twitter with your trend analysis. 

Ensure that the Trend hooks are written in Twitter style and are emotional, attention grabbing, and clickbaity enough like a real Twitter post.

Same with Narrative, give a highly descriptive and informative idea of the narrative that's happening that it could be useful to create Twitter threads from

Ensure that "trend sources" match with the titles used to create this trend, so we can give clear attribution for how where each trend comes from. 

Give an integer trend_viral_score out of 10 on the viral chances of this.

Only get the first ~10-15 titles, more are not needed.`;

export async function POST() {
  try {
    // Check existing blob first
    const { blobs } = await list();
    const trendsBlob = blobs.find(blob => blob.pathname === 'trends.json');

    if (trendsBlob) {
      const response = await fetch(trendsBlob.url);
      const existingData = await response.json();
      
      // Check if last update was less than 1 hour ago
      const lastUpdateTime = new Date(existingData.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (lastUpdateTime > oneHourAgo) {
        return NextResponse.json({
          success: true,
          message: 'Using existing trends - last update was less than 1 hour ago',
          url: trendsBlob.url
        });
      }
    }

    // Initialize Firecrawl
    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY || ''
    });

    // Extract trends using Firecrawl
    const scrapeResult = await app.scrapeUrl(FIRECRAWL_URL, {
      formats: ["extract"],
      extract: { 
        schema: schema,
        systemPrompt: SYSTEM_PROMPT
      }
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }

    // Store the extracted data with timestamp in Vercel Blob
    const blobData = {
      timestamp: new Date().toISOString(),
      results: scrapeResult.extract
    };

    const blob = await put('trends.json', JSON.stringify(blobData), {
      access: 'public',
      contentType: 'application/json'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Trends extracted and stored successfully',
      url: blob.url 
    });

  } catch (error) {
    console.error('Error extracting trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to extract trends' },
      { status: 500 }
    );
  }
} 