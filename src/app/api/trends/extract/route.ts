import { NextResponse } from 'next/server';
import FirecrawlApp from "@mendable/firecrawl-js";
import { put, list, del } from '@vercel/blob';
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
  linkHref: z.string()
});

const schema = z.object({
  links: z.array(linkSchema)
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

const SIX_HOURS = 6 * 60 * 60 * 1000;

export const maxDuration = 60;
export async function POST() {
  try {
    // Process each category
    await Promise.all(
      Object.entries(CATEGORIES).map(async ([category, config]) => {
        console.log(`Processing category "${category}"`);
        
        const { blobs } = await list();
        const linksBlob = blobs.find(blob => blob.pathname === `links-${category}.json`);
        const trendsBlob = blobs.find(blob => blob.pathname === `trends-${category.toLowerCase()}.json`);

        // Check if we have recent data
        if (linksBlob && trendsBlob) {
          const linksResponse = await fetch(linksBlob.url);
          const trendsResponse = await fetch(trendsBlob.url);
          const linksData = await linksResponse.json();
          const trendsData = await trendsResponse.json();
          
          const linksUpdateTime = new Date(linksData.timestamp);
          const trendsUpdateTime = new Date(trendsData.timestamp);
          const sixHoursAgo = new Date(Date.now() - SIX_HOURS);
          
          if (linksUpdateTime > sixHoursAgo && trendsUpdateTime > sixHoursAgo) {
            console.log(`Skipping ${category} - last update was less than 6 hours ago`);
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
                schema: schema,
                systemPrompt: SYSTEM_PROMPT
              }
            });
          });

          if (!scrapeResult.success) {
            throw new Error(`Failed to scrape ${category}: ${scrapeResult.error}`);
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

          await put(`links-${category}.json`, JSON.stringify(blobData), {
            access: 'public',
            contentType: 'application/json'
          });

          console.log(`Successfully processed ${category}`);

          const linksForLLM = blobData.linksData.slice(0, 10).map(link => ({
            title: link.title,
            linkHref: link.linkHref,
            linkId: link.linkId,
            number_of_upvotes: link.number_of_upvotes,
            number_of_comments: link.number_of_comments,
          }));

          // Process with Claude
          const trends = await retryOperation(async () => {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY || '',
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                messages: [{
                  role: 'user',
                  content: `Analyze these tech news links and identify key trends. Return an array of trend objects that exactly match this TypeScript type:

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
                  - trend_suggestions should be an array of 3 detailed content suggestions. Each suggestion should be multiple paragraphs describing what content can be created, viral hooks to use, and narratives for Twitter threads. Give plenty of detail for each with multpile examples, viral hook suggestions, title suggestions, narratives, etc. Make it prose style and detailed, not bullet points they are confusing. Explain reasoning for your suggestions as well, convincing the user why this angle works. Ensure that each suggestion tackles the issue from a different angle. This is the most important thing, so it should be EXTENSIVE. Use HTML <b> or <i> to place emphasis where needed. Ensure that each item in suggestions starts with a title, explains WHY this suggestion works, and then explains the suggestion. Ensure each suggestion is multiple paragraphs separated by <br>. Ensure that the title is contained with an <h3>.

                  REPLY STRICTLY WITH THE JOSN AND NOTHING ELSE, OR I WILL LOSE MY JOB.

                  Here are the links to analyze:
                  ${JSON.stringify(linksForLLM, null, 2)}`
                }],
                max_tokens: 4096
              })
            });

            const claudeResponse = await response.json();
            
            if (!claudeResponse.content || !claudeResponse.content[0]?.text) {
              console.error('Invalid response from Claude:', claudeResponse);
              throw new Error('Invalid response from Claude');
            }

            const claudeResponseText = claudeResponse.content[0].text;
            return JSON.parse(claudeResponseText)?.trends;
          });

          const trendData = {
            timestamp: new Date().toISOString(),
            category: config.name,
            results: {
              trends,
              linksData: blobData.linksData
            }
          };

          // Delete old trends blob if exists
          if (trendsBlob) {
            await del(trendsBlob.url);
          }

          await put(`trends-${category.toLowerCase()}.json`, JSON.stringify(trendData), {
            access: 'public',
            contentType: 'application/json'
          });

          console.log(`Successfully saved trends for ${category}`);
          return trendData;

        } catch (error) {
          console.error(`Failed to process ${category}:`, error);
          
          // Use existing data as fallback if available
          if (trendsBlob) {
            console.log(`Using last good data for ${category}`);
            const response = await fetch(trendsBlob.url);
            return await response.json();
          }
          
          return null;
        }
      })
    );

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