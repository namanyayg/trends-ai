# Technical Specification

## System Overview
The system is designed to display and analyze trends from various subreddits. It consists of a frontend built with Next.js and Tailwind CSS, and a backend that handles data extraction, processing, and storage. The main components include frontend components for rendering the UI, backend services for data extraction and retrieval, and utility functions for data processing and API interactions.

## Core Functionality

### Frontend Components

1. **`src/app/layout.tsx`**
   - **Primary Exported Function**: `RootLayout`
   - **Core Behavior**: Defines the root layout for the application.
   - **Key Details**:
     - Imports and applies global CSS.
     - Sets up metadata for the application.
     - Integrates Google Analytics.
     - Applies custom fonts using `next/font/google`.

2. **`src/app/page.tsx`**
   - **Primary Exported Function**: `Home`
   - **Core Behavior**: Renders the main page of the application.
   - **Key Details**:
     - Forces dynamic rendering and disables revalidation.
     - Renders the `TrendsClient` component.

3. **`src/app/trends-client.tsx`**
   - **Primary Exported Function**: `TrendsClient`
   - **Core Behavior**: Handles the client-side logic for displaying trends.
   - **Key Details**:
     - Manages state for selected category, subreddit, and trends data.
     - Fetches and displays trends based on the selected subreddit.
     - Implements loading and error states.
     - Utilizes custom hooks like `useLoadingMessage` for dynamic loading messages.
     - Renders `TrendCard` components to display individual trends.

### Backend Services

1. **`src/app/api/trends/route.ts`**
   - **Primary Exported Functions**: `GET`
   - **Core Behavior**: Handles API requests to fetch trends data.
   - **Key Details**:
     - Fetches trends data from Vercel Blob storage.
     - Supports fetching specific category trends or all categories.
     - Returns JSON responses with trend data.

2. **`src/app/api/trends/extract/route.ts`**
   - **Primary Exported Functions**: `POST`
   - **Core Behavior**: Handles API requests to extract and process trends data.
   - **Key Details**:
     - Scrapes subreddit data using Firecrawl.
     - Processes extracted data to generate trends using AWS Bedrock (Claude).
     - Stores processed trends data in Vercel Blob storage.
     - Implements retry logic for scraping and processing.

### Configuration and Utility Functions

1. **`src/app/config/subreddits.ts`**
   - **Primary Exported Types**: `SubredditConfig`
   - **Core Behavior**: Defines the configuration for each subreddit.
   - **Key Details**:
     - Specifies URL, name, emoji, color scheme, description, and category for each subreddit.
     - Provides a mapping of subreddits and their configurations.

2. **`src/app/types/trends.ts`**
   - **Primary Exported Types**: `Link`, `Trend`, `TrendsData`
   - **Core Behavior**: Defines the data models for links, trends, and trends data.
   - **Key Details**:
     - Uses Zod for schema validation and type inference.
     - Specifies the structure of link and trend objects.

3. **`src/app/utils/api.ts`**
   - **Primary Exported Function**: `getTrendsData`
   - **Core Behavior**: Fetches trends data from an API.
   - **Key Details**:
     - Deduplicates and sorts trends data by category and timestamp.

4. **`src/app/utils/bedrock.ts`**
   - **Primary Exported Function**: `invokeClaude`
   - **Core Behavior**: Invokes the Claude model via AWS Bedrock to generate trends.
   - **Key Details**:
     - Constructs and sends a request to the Claude model.
     - Parses and returns the generated trends data.

## Architecture

### Data Flow

1. **Data Extraction**
   - The `POST` route in `src/app/api/trends/extract/route.ts` scrapes subreddit data using Firecrawl.
   - The scraped data is processed using AWS Bedrock (Claude) to generate trends.
   - The processed trends data is stored in Vercel Blob storage.

2. **Data Retrieval**
   - The `GET` route in `src/app/api/trends/route.ts` fetches trends data from Vercel Blob storage.
   - The fetched data is returned as a JSON response.

3. **Client-Side Rendering**
   - The `TrendsClient` component in `src/app/trends-client.tsx` fetches and displays the trends data.
   - The component manages the state for selected category and subreddit, and renders `TrendCard` components to display individual trends.

4. **Global Styles and Layout**
   - The `RootLayout` component in `src/app/layout.tsx` applies global CSS styles and sets up the root layout for the application.
   - The `globals.css` file defines global CSS styles using Tailwind CSS.