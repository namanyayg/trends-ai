# Trends AI

Getting inspiration for writing content is a pain. You end up spending hours reading through posts, trying to connect the dots, and probably missing a bunch of stuff anyway.

That's why I built Trends AI. It's a simple tool that watches Reddit for you and uses AI to figure out what people are actually talking about. Instead of just counting upvotes or keywords, it actually understands the conversations happening across different subreddits and tells you what's important and why.

No fancy dashboards or complex analytics&mdash;just clear insights about what's trending and why it matters. Free and open source, forever.

## Usage

1. Open the application in your browser
2. Select subreddits to analyze
3. View AI-generated trend analysis and insights

## Project Structure

- `/src/app/api/trends` - Backend API endpoints
- `/src/app/utils` - Utility functions and AWS Bedrock integration
- `/src/app/types` - TypeScript type definitions
- `/src/app/config` - Configuration files

## Requirements

- Node.js 18 or newer
- AWS account with Bedrock access
- Firecrawl API keys

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

4. Required environment variables:
- AWS credentials for Bedrock
- Firecrawl API keys
- Other configuration (see `.env.example`)

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`
