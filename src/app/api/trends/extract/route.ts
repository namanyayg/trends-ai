import { NextResponse } from 'next/server';
import FirecrawlApp from "@mendable/firecrawl-js";
import { put, list, del } from '@vercel/blob';
import { z } from "zod";
import { SUBREDDITS } from '@/app/config/subreddits';
import { invokeClaude } from '@/app/utils/bedrock';
import { linkSchema, trendsResponseSchema } from '@/app/types/trends';

// Define the schema for firecrawl extraction
const extractionSchema = z.object({
  links: z.array(linkSchema)
});

const SYSTEM_PROMPT = `For each link, generate a linkId by taking the first 6 characters of the title (lowercase, alphanumeric only) plus a random 2-digit number. For example "nvidia announces" might become "nvidia23". Also extract the linkHref from the post's URL if available.

Focus only on substantial news, technical developments, and meaningful stories. Avoid any memes, image-based content, or purely entertainment posts.

Only get the first ~10-15 titles, more are not needed.`;

// Add retry helper function
async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 1): Promise<T> {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        console.log(`Attempt ${i + 1} failed, retrying...`);
        // Wait for 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  throw lastError;
}

const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const maxDuration = 60;

// Helper function to process a single subreddit
async function processSubreddit(subredditKey: string, config: typeof SUBREDDITS[keyof typeof SUBREDDITS]) {
  console.log(`Processing subreddit "${subredditKey}"`);
  
  const { blobs } = await list();
  const linksBlob = blobs.find(blob => blob.pathname === `links-${subredditKey}.json`);
  const trendsBlob = blobs.find(blob => blob.pathname === `trends-${subredditKey}.json`);

  // Check if we have recent data
  if (linksBlob && trendsBlob) {
    const linksResponse = await fetch(linksBlob.url);
    const trendsResponse = await fetch(trendsBlob.url);
    const linksData = await linksResponse.json();
    const trendsData = await trendsResponse.json();
    
    const linksUpdateTime = new Date(linksData.timestamp);
    const trendsUpdateTime = new Date(trendsData.timestamp);
    const oneDayAgo = new Date(Date.now() - ONE_DAY);

    if (!trendsData.results || !trendsData.results.trends) {
      console.log(`Trends data for ${subredditKey} is invalid, deleting and retrying...`);
      await del(linksBlob.url);
      await del(trendsBlob.url);
      return await processSubreddit(subredditKey, config);
    }
    
    if (linksUpdateTime > oneDayAgo && trendsUpdateTime > oneDayAgo) {
      console.log(`Skipping ${subredditKey} - last update was less than 1 day ago`);
      console.log("Trend data:")
      console.log(JSON.stringify(trendsData, null, 2));
      return trendsData;
    }
  }

  // Initialize Firecrawl
  const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY || ''
  });

  console.log(`Scraping ${config.url}`);
  
  try {
    // Try scraping with retry logic
    const scrapeResult = await retryOperation(async () => {
      return await app.scrapeUrl(config.url, {
        formats: ["extract"],
        extract: { 
          schema: extractionSchema,
          systemPrompt: SYSTEM_PROMPT
        }
      });
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape ${subredditKey}: ${scrapeResult.error}`);
    }

    const blobData = {
      timestamp: new Date().toISOString(),
      category: config.name,
      linksData: scrapeResult.extract?.links || []
    };

    // Delete old blob if exists
    if (linksBlob) {
      await del(linksBlob.url);
    }

    await put(`links-${subredditKey}.json`, JSON.stringify(blobData), {
      access: 'public',
      contentType: 'application/json'
    });

    console.log(`Successfully processed ${subredditKey}`);

    const linksForLLM = blobData.linksData.slice(0, 10).map(link => ({
      title: link.title,
      linkId: link.linkId,
      number_of_upvotes: link.number_of_upvotes,
      number_of_comments: link.number_of_comments,
    }));

    // Process with Claude via AWS Bedrock
    const trends = await retryOperation(async () => {
      const prompt = `Analyze these ${config.name} news links and identify top 3 key trends. Return an array of trend objects that exactly match this TypeScript type:

      type Trend = {
        trend_viral_score: string,
        trend_title: string,
        trend_sources: string[],
        trend_overview: string,
        trend_suggestions: string[]
      }

      For each trend:
      - trend_viral_score should be a number from 1-10 as a string, based on the combined upvotes, comments, and overall impact
      - trend_title should be a clear headline, telling about what the trend is
      - trend_sources should be an array of relevant article linkIds from the input that support this trend
      - trend_overview should be a short overview of the trend, describing what it is and why it is important
      - trend_suggestions should be an ARRAY of 3 detailed content suggestions. Each suggestion should be multiple paragraphs describing what content can be created, viral hooks to use, and narratives for Twitter threads. Give plenty of detail for each with multpile examples, viral hook suggestions, title suggestions, narratives, etc. Make it prose style and detailed, not bullet points they are confusing. Explain reasoning for your suggestions as well, convincing the user why this angle works. Ensure that each suggestion tackles the issue from a different angle. This is the most important thing, so it should be EXTENSIVE. Use HTML <b> or <i> to place emphasis where needed. Ensure that each item in suggestions starts with a title, explains WHY this suggestion works, and then explains the suggestion. Ensure each suggestion is multiple paragraphs separated by <br>. Ensure that the title is contained with an <h3>.

      ENSURE NO NESTED QUOTES. OTHERWISE IT CAUSES FORMATTING ERRORS.
      REPLY STRICTLY WITH EXACT JSON FORMATTING AND NOTHING ELSE, OR I WILL LOSE MY JOB.

      Here are the links to analyze:
      ${JSON.stringify(linksForLLM, null, 2)}`;

      const response = await invokeClaude(prompt);
      if (response?.trends) {
        return response.trends;
      } else {
        return response;
      }
    });

    if (!trends) {
      throw new Error("No trends found in response");
    }
    
    // Validate trends match our schema
    const validationResult = trendsResponseSchema.safeParse(trends);
    if (!validationResult.success) {
      console.error('Invalid trends format:', validationResult.error);
      throw new Error('Claude output does not match expected Trend type format');
    }
    
    const trendData = {
      timestamp: new Date().toISOString(),
      category: config.name,
      results: {
        trends,
        linksData: blobData.linksData
      }
    };

    console.log("Trend data:")
    console.log(JSON.stringify(trendData, null, 2));

    // Delete old trends blob if exists
    if (trendsBlob) {
      await del(trendsBlob.url);
    }

    await put(`trends-${subredditKey}.json`, JSON.stringify(trendData), {
      access: 'public',
      contentType: 'application/json'
    });

    console.log(`Successfully saved trends for ${subredditKey}`);
    return trendData;

  } catch (error) {
    console.error(`Failed to process ${subredditKey}:`, error);
    
    // Use existing data as fallback if available
    if (trendsBlob) {
      console.log(`Using last good data for ${subredditKey}`);
      const response = await fetch(trendsBlob.url);
      return await response.json();
    }
    
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { subreddit } = await request.json();

    if (!subreddit || !SUBREDDITS[subreddit]) {
      return NextResponse.json(
        { success: false, error: 'Invalid subreddit' },
        { status: 400 }
      );
    }

    const result = await processSubreddit(subreddit, SUBREDDITS[subreddit]);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to process subreddit' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result
    });

  } catch (error) {
    console.error('Error extracting trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to extract trends' },
      { status: 500 }
    );
  }
}