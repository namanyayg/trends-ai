import { Suspense } from 'react';

// Types for our data
type Link = {
  title: string;
  number_of_upvotes: number;
  number_of_comments: number;
  website_domain: string;
  topics: string[];
  companies_mentioned: string[];
};

type Trend = {
  trend_viral_score: string;
  trend_title: string;
  trend_sources: string[];
  trend_hooks: string[];
  trend_narratives: string[];
};

type TrendsData = {
  timestamp: string;
  results: {
    links: Link[];
    trends: Trend[];
    future_trends: string[];
  };
};

// Modular components
const LinkCard = ({ link }: { link: Link }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all">
    <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
    <div className="flex gap-4 text-sm text-gray-400 mb-3">
      <span>⬆️ {link.number_of_upvotes.toLocaleString()}</span>
      <span>💬 {link.number_of_comments.toLocaleString()}</span>
      <span>🌐 {link.website_domain}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {link.topics.map((topic) => (
        <span key={topic} className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">
          {topic}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {link.companies_mentioned.map((company) => (
        <span key={company} className="px-2 py-1 bg-purple-500/20 rounded-full text-xs">
          {company}
        </span>
      ))}
    </div>
  </div>
);

const TrendCard = ({ trend }: { trend: Trend }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-2xl font-bold">{trend.trend_title}</h3>
      <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm">
        Score: {trend.trend_viral_score}/10
      </span>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold mb-2">🎯 Viral Hooks</h4>
        <div className="space-y-2">
          {trend.trend_hooks.map((hook, i) => (
            <p key={i} className="text-sm bg-white/5 p-3 rounded">
              {hook}
            </p>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-2">📝 Narratives</h4>
        <div className="space-y-2">
          {trend.trend_narratives.map((narrative, i) => (
            <p key={i} className="text-sm text-gray-300">
              {narrative}
            </p>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-2">🔗 Sources</h4>
        <div className="space-y-1">
          {trend.trend_sources.map((source, i) => (
            <p key={i} className="text-sm text-blue-400">
              {source}
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FutureTrendsList = ({ trends }: { trends: string[] }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">🔮 Future Trends</h2>
    <div className="space-y-2">
      {trends.map((trend, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-purple-400">•</span>
          <p className="text-gray-300">{trend}</p>
        </div>
      ))}
    </div>
  </div>
);

// Data fetching function
async function getTrendsData(): Promise<{ success: boolean; data: TrendsData }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/trends`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

// Main component
async function TrendsDisplay() {
  const { data } = await getTrendsData();
  const lastUpdated = new Date(data.timestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tech Trends Analysis</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        <div className="grid gap-8">
          {/* Trending Topics Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">🔥 Trending Topics</h2>
            <div className="grid gap-6">
              {data.results.trends.map((trend: Trend) => (
                <TrendCard key={trend.trend_title} trend={trend} />
              ))}
            </div>
          </section>

          {/* Popular Links Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">📰 Popular Stories</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {data.results.links.map((link: Link) => (
                <LinkCard key={link.title} link={link} />
              ))}
            </div>
          </section>

          {/* Future Trends Section */}
          <section>
            <FutureTrendsList trends={data.results.future_trends} />
          </section>
        </div>
      </div>
    </div>
  );
}

// Page component with loading state
export default function TrendsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading trends...</p>
        </div>
      </div>
    }>
      <TrendsDisplay />
    </Suspense>
  );
} 