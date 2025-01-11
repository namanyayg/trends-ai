import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

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
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{link.title}</h3>
    <div className="flex gap-4 text-gray-600 mb-3">
      <span className="flex items-center gap-1">⬆️ {link.number_of_upvotes.toLocaleString()}</span>
      <span className="flex items-center gap-1">💬 {link.number_of_comments.toLocaleString()}</span>
      <span className="flex items-center gap-1">🌐 {link.website_domain}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {link.topics.map((topic) => (
        <span key={topic} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          {topic}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {link.companies_mentioned.map((company) => (
        <span key={company} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
          {company}
        </span>
      ))}
    </div>
  </div>
);

const TrendCard = ({ trend }: { trend: Trend }) => (
  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-2xl font-bold text-gray-800">{trend.trend_title}</h3>
      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold">
        Score: {trend.trend_viral_score}/10
      </span>
    </div>
    
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          📝 Narratives
        </h4>
        <div className="space-y-3">
          {trend.trend_narratives.map((narrative, i) => (
            <p key={i} className="text-gray-600 leading-relaxed">
              {narrative}
            </p>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          🎯 Viral Hooks
        </h4>
        <div className="space-y-3">
          {trend.trend_hooks.map((hook, i) => (
            <p key={i} className="bg-blue-50 p-4 rounded-lg text-gray-700">
              {hook}
            </p>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          🔗 Sources
        </h4>
        <div className="space-y-2">
          {trend.trend_sources.map((source, i) => (
            <p key={i} className="text-blue-600 hover:text-blue-700">
              {source}
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FutureTrendsList = ({ trends }: { trends: string[] }) => (
  <div className="my-12">
    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
      🔮 Future Trends
    </h2>
    <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-8 shadow-lg">
      {trends.map((trend, i) => (
        <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
          <span className="text-emerald-500">✓</span>
          <p className="text-lg text-gray-700">{trend}</p>
        </div>
      ))}
    </div>
  </div>
);

// Data fetching function
async function getTrendsData(): Promise<{ success: boolean; data: TrendsData }> {
  const res = await fetch('/api/trends', { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

// Main component
async function TrendsDisplay() {
  const { data } = await getTrendsData();
  // const lastUpdated = new Date(data.timestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-emerald-400 text-white">
        <div className="text-center mx-auto px-8 py-24">
          <div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Trends AI
            </h1>
            <h2 className="text-2xl text-blue-50 mb-8">
              Find viral tech topics in 30 seconds, not 3 hours
            </h2>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid gap-16">
          {/* Trending Topics Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
              🔥 Trending Topics
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {data.results.trends.map((trend: Trend) => (
                <TrendCard key={trend.trend_title} trend={trend} />
              ))}
            </div>
          </section>

          {/* Future Trends Section */}
          <section>
            <FutureTrendsList trends={data.results.future_trends} />
          </section>

          {/* Popular Links Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
              📰 Popular Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {data.results.links.map((link: Link) => (
                <LinkCard key={link.title} link={link} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Page component with loading state
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading trends...</p>
        </div>
      </div>
    }>
      <TrendsDisplay />
    </Suspense>
  );
}
