export type SubredditConfig = {
  url: string;
  name: string;
  emoji: string;
  color: {
    gradient: string;
    accentLight: string;
    accentDark: string;
  };
  description: string;
  category: 'technology';
};

export const SUBREDDITS: Record<string, SubredditConfig> = {
  // Technology Category
  technology: {
    url: "https://redlib.catsarch.com/r/technology/top?t=day",
    name: "Technology",
    emoji: "💻",
    color: {
      gradient: "from-blue-500 to-indigo-600",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-500 text-white"
    },
    description: "General technology news and discussions",
    category: "technology"
  },
  programming: {
    url: "https://redlib.catsarch.com/r/programming/top?t=week",
    name: "Programming",
    emoji: "👨‍💻",
    color: {
      gradient: "from-purple-500 to-indigo-600",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-500 text-white"
    },
    description: "Software development and programming",
    category: "technology"
  },
  artificial: {
    url: "https://redlib.catsarch.com/r/artificial/top?t=day",
    name: "Artificial Intelligence",
    emoji: "🤖",
    color: {
      gradient: "from-red-500 to-rose-600",
      accentLight: "bg-red-50 text-red-600",
      accentDark: "bg-red-500 text-white"
    },
    description: "AI and machine learning news",
    category: "technology"
  }
};

// Group subreddits by category
export const CATEGORIES = {
  technology: "Technology & Programming"
};

export const getSubredditsByCategory = (category: keyof typeof CATEGORIES) => {
  return Object.entries(SUBREDDITS)
    .filter(([, config]) => config.category === category)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}; 