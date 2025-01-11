export type Link = {
  title: string;
  number_of_upvotes: number;
  number_of_comments: number;
  website_domain: string;
  topics: string[];
  companies_mentioned: string[];
  linkId: string;
  linkHref?: string;
};

export type Trend = {
  trend_viral_score: string;
  trend_title: string;
  trend_sources: string[];
  trend_hooks: string[];
  trend_narratives: string[];
};

export type TrendsData = {
  timestamp: string;
  category: string;
  results: {
    links: Link[];
    trends: Trend[];
    future_trends: string[];
  };
}; 