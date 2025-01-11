'use client';

import { useState } from 'react';

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
  trend_hooks: string[];
  trend_narratives: string[];
};

type TrendsData = {
  timestamp: string;
  category: string;
  results: {
    links: Link[];
    trends: Trend[];
    future_trends: string[];
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

// Modular components
const LinkCard = ({ link, categoryConfig }: { link: Link; categoryConfig: typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG] }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
    <h3 className="text-xl font-semibold mb-2 text-gray-800">
      {link.linkHref ? (
        <a href={link.linkHref} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
          {link.title}
        </a>
      ) : (
        link.title
      )}
    </h3>
    <div className="flex gap-4 text-gray-600 mb-3">
      <span className="flex items-center gap-1">⬆️ {link.number_of_upvotes.toLocaleString()}</span>
      <span className="flex items-center gap-1">💬 {link.number_of_comments.toLocaleString()}</span>
      <span className="flex items-center gap-1">🌐 {link.website_domain}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {link.topics.map((topic) => (
        <span key={topic} className={`px-3 py-1 ${categoryConfig.accentLight} rounded-full text-sm font-medium`}>
          {topic}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {link.companies_mentioned.map((company) => (
        <span key={company} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
          {company}
        </span>
      ))}
    </div>
  </div>
);

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

  return (
    <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{trend.trend_title}</h3>
        {trend.trend_viral_score && <span className={`shrink-0 px-4 py-2 ${categoryConfig.accentLight} font-semibold rounded-lg`}>
          Score:&nbsp;{trend.trend_viral_score}/10
        </span>}
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            📝 Narratives
          </h4>
          <div className="space-y-3">
            {trend.trend_narratives.map((narrative, i) => (
              <p key={i} className="text-gray-600 leading-relaxed break-words">
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
              <p key={i} className={`${categoryConfig.accentLight} p-4 rounded-lg break-words`}>
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
            {trend.trend_sources.map((sourceId, i) => {
              const link = getLinkDetails(sourceId);
              if (!link) return null;
              return (
                <span
                  key={i}
                  className="flex items-center gap-2 text-gray-500 group break-words"
                >
                  {link.linkHref ? (
                    <a href={link.linkHref} target="_blank" rel="noopener noreferrer" className="break-all hover:text-blue-600 transition-colors">
                      {link.title}
                    </a>
                  ) : (
                    <span className="break-all">{link.title}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const FutureTrendsList = ({ trends, categoryConfig }: { trends: string[]; categoryConfig: typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG] }) => (
  <div className="my-12">
    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
      🔮 Future Trends
    </h2>
    <div className={`bg-gradient-to-br ${categoryConfig.gradient} rounded-xl p-8 shadow-lg text-white`}>
      {trends.map((trend, i) => (
        <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
          <span>✓</span>
          <p className="text-lg">{trend}</p>
        </div>
      ))}
    </div>
  </div>
);

// Category tabs component
const CategoryTabs = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: { name: string; data: TrendsData }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {categories.map(({ name }) => {
      const config = CATEGORY_CONFIG[name as keyof typeof CATEGORY_CONFIG];
      return (
        <button
          key={name}
          onClick={() => onCategoryChange(name)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeCategory === name
              ? `${config.accentDark}`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{config.icon}</span>
          <span>{name}</span>
        </button>
      );
    })}
  </div>
);

// Main client component
export function TrendsClient({ trendsData }: { trendsData: TrendsData[] }) {
  // Sort categories to ensure Technology comes first
  const sortedCategories = trendsData
    .sort((a, b) => {
      if (a.category === "Technology") return -1;
      if (b.category === "Technology") return 1;
      return a.category.localeCompare(b.category);
    })
    .map(data => ({
      name: data.category,
      data: data
    }));

  const [activeCategory, setActiveCategory] = useState(sortedCategories[0]?.name || '');
  const activeData = sortedCategories.find(cat => cat.name === activeCategory)?.data;
  const activeCategoryConfig = CATEGORY_CONFIG[activeCategory as keyof typeof CATEGORY_CONFIG];

  if (!activeData || !activeCategoryConfig) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${activeCategoryConfig.gradient} text-white`}>
        <div className="text-center mx-auto px-4 sm:px-8 py-24 max-w-7xl">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Trends AI
            </h1>
            <h2 className="text-xl sm:text-2xl opacity-90 mb-8">
              Find viral {activeCategory.toLowerCase()} topics in 30 seconds, not 3 hours
            </h2>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid gap-8 sm:gap-16">
          {/* Category Tabs */}
          <div className="flex justify-center">
            <CategoryTabs 
              categories={sortedCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Trending Topics Section */}
          <section>
            <h2 className="text-3xl text-center font-bold mb-8 text-gray-800">
              {activeCategoryConfig.icon} {activeData.category} Trending Topics
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {activeData.results.trends.map((trend: Trend) => (
                <TrendCard 
                  key={trend.trend_title} 
                  trend={trend} 
                  categoryConfig={activeCategoryConfig}
                  links={activeData.results.links}
                />
              ))}
            </div>
          </section>

          {/* Future Trends Section */}
          {activeData.results.future_trends.length > 0 && <section>
            <FutureTrendsList 
              trends={activeData.results.future_trends} 
              categoryConfig={activeCategoryConfig}
              />
            </section>}

          {/* Popular Links Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
              {activeCategoryConfig.icon} {activeData.category} Popular Stories
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {activeData.results.links.map((link: Link) => (
                <LinkCard 
                  key={link.title} 
                  link={link} 
                  categoryConfig={activeCategoryConfig}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 