'use client';

// Types for our data
type Link = {
  title: string;
  number_of_upvotes: number;
  number_of_comments: number;
  website_domain: string;
  topics: string[];
  companies_mentioned: string[];
  linkId: string;
  linkHref?: string;
};

type Trend = {
  trend_viral_score: string;
  trend_title: string;
  trend_sources: string[];
  trend_overview: string;
  trend_suggestions: string[];
};

type TrendsData = {
  timestamp: string;
  category: string;
  results: {
    trends: Trend[];
    linksData: Link[];
  };
};

// Category configuration with colors
const CATEGORY_CONFIG = {
  Technology: {
    gradient: 'from-blue-500 to-indigo-600',
    accentLight: 'bg-blue-50 text-blue-600',
    accentDark: 'bg-blue-500 text-white',
    icon: '💻'
  },
  Cryptocurrency: {
    gradient: 'from-orange-500 to-amber-600',
    accentLight: 'bg-orange-50 text-orange-600',
    accentDark: 'bg-orange-500 text-white',
    icon: '₿'
  },
  Finance: {
    gradient: 'from-emerald-500 to-green-600',
    accentLight: 'bg-emerald-50 text-emerald-600',
    accentDark: 'bg-emerald-500 text-white',
    icon: '📈'
  }
};

const TrendCard = ({ 
  trend, 
  categoryConfig, 
  links 
}: { 
  trend: Trend; 
  categoryConfig: typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG];
  links: Link[];
}) => {
  // Function to get link details from linkId
  const getLinkDetails = (linkId: string) => {
    const link = links.find(l => l.linkId === linkId);
    return link || null;
  };

  if (!trend) return null;
  if (!trend.trend_suggestions) return null;

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      {/* Header with Title and Score */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 break-words leading-tight">
          {trend.trend_title}
        </h3>
        {trend.trend_viral_score && (
          <div className={`shrink-0 px-4 py-2 ${categoryConfig.accentLight} font-semibold rounded-lg flex items-center gap-2`}>
            <span className="text-lg">🔥</span>
            <span>Score: {trend.trend_viral_score}/10</span>
          </div>
        )}
      </div>
      
      {/* Overview Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <span>📊</span> Overview
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {trend.trend_overview}
        </p>
      </div>
      
      {/* Content Suggestions Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <span>💡</span> Content Ideas
        </h4>
        <div className="space-y-4">
          {trend.trend_suggestions.map((suggestion, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-lg ${categoryConfig.accentLight} bg-opacity-50`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="mr-2 flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </div>
                <p className="whitespace-pre-line text-gray-700" dangerouslySetInnerHTML={{ __html: suggestion }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources Section */}
      <div className="my-8">
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <span>🔗</span> Source Articles
        </h4>
        <div className="space-y-3">
          {trend.trend_sources.map((sourceId, i) => {
            const link = getLinkDetails(sourceId);
            if (!link) return null;
            return (
              <div
                key={i}
                className="group"
              >
                {link.linkHref ? (
                  <a 
                    href={link.linkHref} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <h5 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-sm text-gray-500">
                            ⬆️ {link.number_of_upvotes.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            💬 {link.number_of_comments.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            🌐 {link.website_domain}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div>
                        <h5 className="font-medium text-gray-800">{link.title}</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-sm text-gray-500">
                            ⬆️ {link.number_of_upvotes.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            💬 {link.number_of_comments.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main client component
export function TrendsClient({ trendsData }: { trendsData: TrendsData[] }) {
  // Sort categories to ensure Technology comes first
  const sortedCategories = trendsData.length > 0 ? trendsData
    .sort((a, b) => {
      if (a.category === "Technology") return -1;
      if (b.category === "Technology") return 1;
      return a.category.localeCompare(b.category);
    })
    .map((data, index) => ({
      name: data.category,
      data: data,
      id: `${data.category.toLowerCase()}-${index}`
    })) : [];

  if (!trendsData || trendsData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <div>
        <div className="text-center mx-auto px-4 sm:px-8 py-8 max-w-7xl">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Trends AI
            </h1>
            <h2 className="text-xl sm:text-2xl opacity-90">
              Find viral topics in 30 seconds, not 3 hours
            </h2>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid gap-16">
          {sortedCategories.map(category => {
            const categoryConfig = CATEGORY_CONFIG[category.name as keyof typeof CATEGORY_CONFIG];
            if (!categoryConfig) return null;

            return (
              <section key={category.id}>
                <div className="grid gap-8">
                  {(category.data.results?.trends || []).map((trend: Trend) => (
                    <TrendCard 
                      key={`${category.id}-${trend.trend_title}`} 
                      trend={trend} 
                      categoryConfig={categoryConfig}
                      links={category.data.results?.linksData || []}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
} 