'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SUBREDDITS, CATEGORIES, SubredditConfig, getSubredditsByCategory } from './config/subreddits';

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

// Add loading messages array
const LOADING_MESSAGES = [
  "🔍 Scanning the latest discussions...",
  "🤖 Analyzing trending topics...",
  "📊 Identifying viral patterns...",
  "💡 Generating content ideas...",
  "🎯 Finding key insights...",
  "📝 Crafting trend summaries...",
  "🔗 Gathering source articles...",
  "✨ Finalizing your trends report..."
];

// Add TrendCardSkeleton component
const TrendCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="h-7 bg-gray-200 rounded w-3/4"></div>
        <div className="h-7 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="mt-4 h-20 bg-gray-200 rounded"></div>
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TrendCard = ({ 
  trend, 
  subredditConfig,
  links 
}: { 
  trend: Trend; 
  subredditConfig: SubredditConfig;
  links: Link[];
}) => {
  const [expandedSuggestions, setExpandedSuggestions] = useState<{[key: number]: boolean}>({});
  const [showSources, setShowSources] = useState(false);

  // Process suggestions to extract title and subtitle
  const processedSuggestions = (trend.trend_suggestions || []).map(suggestion => {
    // Split on <br> or <br/> tags
    const parts = suggestion.split(/<br\s*\/?>/);
    
    // Extract title from <h3> tags in first part
    const titleMatch = parts[0]?.match(/<h3>(.*?)<\/h3>/);
    const title = titleMatch ? titleMatch[1] : '';

    // Get subtitle from second part (after first </h3>)
    const subtitle = parts[0].split('</h3>')[1] || '';

    // Join remaining parts with <br> tags
    const remaining = parts.slice(1).join('</p><p>');

    return {
      title,
      subtitle,
      remaining
    };
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {trend.trend_title}
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${subredditConfig.color.accentLight} whitespace-nowrap`}>
            🔥 {trend.trend_viral_score}&nbsp;/&nbsp;10
          </div>
        </div>

        {/* Overview */}
        <p className="mt-4 text-gray-600">
          {trend.trend_overview}
        </p>

        {/* Content Suggestions */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💡</span>
            <h4 className="font-semibold text-gray-900">Content Ideas</h4>
          </div>

          <div className="space-y-4">
            {processedSuggestions.map((suggestion, index) => (
              <div key={index} className={`p-6 rounded-lg bg-gray-50`}>
                {/* Title and Toggle */}
                <div className="flex items-center gap-4">
                  <div 
                    className="text-lg font-semibold text-gray-900 block"
                    dangerouslySetInnerHTML={{ __html: suggestion.title }}
                  />
                  <button
                    onClick={() => setExpandedSuggestions(prev => ({
                      ...prev,
                      [index]: !prev[index]
                    }))}
                    className="text-black/30 hover:text-black/40 transition-colors"
                  >
                    {expandedSuggestions[index] ? '▼' : '▶'}
                  </button>
                </div>

                {/* Subtitle */}
                <div 
                  className="text-base text-gray-600 block italic"
                  dangerouslySetInnerHTML={{ __html: suggestion.subtitle }}
                />

                {/* Remaining content - only show if expanded */}
                {expandedSuggestions[index] && suggestion.remaining && (
                  <div 
                    className="text-gray-600 text-base [&>p]:mb-2 mt-3"
                    dangerouslySetInnerHTML={{ __html: suggestion.remaining }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Source Links */}
        <div className="mt-6">
          <div className="flex items-center my-2 gap-6">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 text-black/30 hover:text-black/40 transition-colors text-sm"
            >
              <h4 className="font-semibold text-gray-900">Sources</h4>
              <span>{showSources ? '▼' : '▶'}</span>
            </button>
          </div>

          {showSources && (
            <div className="space-y-4">
              {trend.trend_sources.map(sourceId => {
                const link = links.find(l => l.linkId === sourceId);
                if (!link) return null;

                return (
                  <a
                    key={sourceId}
                    href={link.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h5 className="font-medium text-gray-900">{link.title}</h5>
                      <div className="flex items-center gap-3 text-sm text-gray-500 whitespace-nowrap">
                        <span>↑ {link.number_of_upvotes}</span>
                        <span>💬 {link.number_of_comments}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>{link.website_domain}</span>
                      {link.topics.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{link.topics.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add useLoadingMessage hook after the types
const useLoadingMessage = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return LOADING_MESSAGES[messageIndex];
};

// Add Footer component before TrendsClient
const Footer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <footer className="text-center py-16">
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="text-blue-500 hover:text-blue-700 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 text-lg"
        >
          Made with ❤️ by Neo
        </button>
      </footer>

      {isDialogOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative mx-4"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              ✕
            </button>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-2xl font-bold mb-6">👋 Hello there!</h3>
              <p className="text-lg leading-relaxed mb-4">
                I built this tool over a weekend to solve my own struggle with information overload. Previously, I was spending hours doomscrolling to stay updated with tech trends. This tool helps cut through the noise. I realized this could help others as well, so I open sourced it. For more information about how I built this, <a href="https://nmn.gl/blog/project-trends-ai" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 no-underline hover:text-blue-600 transition-colors">check out my blog post</a>.
              </p>
              <p className="text-lg leading-relaxed">
                I&apos;m <a href="https://x.com/NamanyayG" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 no-underline hover:text-blue-600 transition-colors">Namanyay aka Neo</a>, a developer passionate about building AI tools that enhance human potential. I write about technology, startups, and the future of work on X and I&apos;d love to earn your follow.
              </p>
              <div className="mt-8 flex justify-center">
                <a 
                  href="https://x.com/NamanyayG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-200 transition-colors font-medium text-lg"
                >
                  Connect on 
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main client component
export function TrendsClient({ initialTrendsData }: { initialTrendsData?: TrendsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('technology');
  const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(null);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(initialTrendsData || null);
  const [loading, setLoading] = useState(false);
  const [loadingSubreddit, setLoadingSubreddit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadingMessage = useLoadingMessage();
  const lastLoadedRef = useRef<string | null>(null);

  const loadTrends = useCallback(async (subredditKey: string) => {
    // Prevent duplicate loads
    if (loading || lastLoadedRef.current === subredditKey) {
      return;
    }
    
    setLoading(true);
    setLoadingSubreddit(subredditKey);
    setError(null);
    lastLoadedRef.current = subredditKey;
    
    try {
      // Update URL without triggering navigation events
      router.push(`/?t=${subredditKey}`, { scroll: false });

      const response = await fetch('/api/trends/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subreddit: subredditKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to load trends');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load trends');
      }

      setTrendsData(data.data);
      setSelectedSubreddit(subredditKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends');
      lastLoadedRef.current = null; // Reset on error to allow retrying
    } finally {
      setLoading(false);
      setLoadingSubreddit(null);
    }
  }, [router, loading]);

  // Initialize from URL or default
  useEffect(() => {
    const subreddit = searchParams.get('t') || 'technology';
    if (SUBREDDITS[subreddit] && lastLoadedRef.current !== subreddit) {
      setSelectedCategory(SUBREDDITS[subreddit].category as keyof typeof CATEGORIES);
      setSelectedSubreddit(subreddit);
      loadTrends(subreddit);
    }
  }, [loadTrends, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <div>
        <div className="text-center mx-auto px-4 sm:px-8 py-8 max-w-7xl mb-2">
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

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Categories">
            {Object.entries(CATEGORIES).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof CATEGORIES)}
                disabled={loading}
                className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm sm:text-base
                  ${selectedCategory === category
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <div className="space-y-9">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-base">
            {(() => {
              const categorySubreddits = getSubredditsByCategory(selectedCategory);
              const subredditEntries = Object.entries(categorySubreddits) as [string, SubredditConfig][];

              return subredditEntries.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => loadTrends(key)}
                  disabled={loading}
                  className={`
                    relative p-4 rounded-lg font-medium transition-all duration-200
                    ${selectedSubreddit === key 
                      ? config.color.accentDark
                      : `${config.color.accentLight} hover:bg-opacity-90 hover:scale-105 hover:shadow-sm`
                    }
                    flex items-center gap-3 justify-center
                    transform hover:translate-y-[-2px]
                    disabled:cursor-not-allowed
                  `}
                >
                  {loadingSubreddit === key && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <span className="text-xl">{config.emoji}</span>
                  <span>{config.name}</span>
                </button>
              ));
            })()}
          </div>

          {/* Selected Subreddit Title */}
          {selectedSubreddit && SUBREDDITS[selectedSubreddit] && (
            <div className="text-center">
              {loading ? (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-96 mx-auto mt-2 animate-pulse"></div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-3">
                    <span>{SUBREDDITS[selectedSubreddit].emoji}</span>
                    <span>Trending in {SUBREDDITS[selectedSubreddit].name}</span>
                  </h3>
                  <p className="text-gray-600 mt-2">{SUBREDDITS[selectedSubreddit].description}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-xl font-medium text-gray-800 animate-pulse">
              {loadingMessage}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              This may take up to 60 seconds
            </div>
          </div>
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <TrendCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Trends Display */}
      {!loading && trendsData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid gap-8">
            {trendsData.results.trends.map((trend) => (
              <TrendCard
                key={trend.trend_title}
                trend={trend}
                subredditConfig={SUBREDDITS[selectedSubreddit!]}
                links={trendsData.results.linksData}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={() => selectedSubreddit && loadTrends(selectedSubreddit)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Add Footer here */}
      <Footer />
    </div>
  );
} 