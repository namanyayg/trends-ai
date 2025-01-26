import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

type ClaudeResponse = {
  content: Array<{
    text: string;
  }>;
};

type Trend = {
  trend_viral_score: string;
  trend_title: string;
  trend_sources: string[];
  trend_overview: string;
  trend_suggestions: string[];
};

type TrendsResponse = {
  trends: Trend[];
};

export async function invokeClaude(prompt: string): Promise<TrendsResponse> {
  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);

    // Parse the response body
    const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as ClaudeResponse;
    
    if (!responseBody.content || !responseBody.content[0]?.text) {
      throw new Error('Invalid response from Claude');
    }

    console.log("Claude response:")
    console.log(responseBody.content[0].text);

    return JSON.parse(responseBody.content[0].text) as TrendsResponse;
  } catch (error) {
    console.error('Error invoking Claude via Bedrock:', error);
    throw error;
  }
} 