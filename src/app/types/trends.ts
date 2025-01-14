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
  trend_overview: string;
  trend_suggestions: string[];
};

export type TrendsData = {
  timestamp: string;
  category: string;
  results: {
    trends: Trend[];
    linksData: Link[];
  };
}; 