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
  category: 'technology' | 'business' | 'science' | 'entertainment' | 'lifestyle' | 'creative';
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
  },
  hardware: {
    url: "https://redlib.catsarch.com/r/hardware/top?t=week",
    name: "Hardware",
    emoji: "🔧",
    color: {
      gradient: "from-stone-500 to-gray-600",
      accentLight: "bg-stone-50 text-stone-600",
      accentDark: "bg-stone-500 text-white"
    },
    description: "Computer hardware and tech",
    category: "technology"
  },
  webdev: {
    url: "https://redlib.catsarch.com/r/webdev/top?t=week",
    name: "Web Development",
    emoji: "🌐",
    color: {
      gradient: "from-sky-500 to-blue-600",
      accentLight: "bg-sky-50 text-sky-600",
      accentDark: "bg-sky-500 text-white"
    },
    description: "Web development trends",
    category: "technology"
  },
  machinelearning: {
    url: "https://redlib.catsarch.com/r/MachineLearning/top?t=day",
    name: "Machine Learning",
    emoji: "🧠",
    color: {
      gradient: "from-fuchsia-500 to-purple-600",
      accentLight: "bg-fuchsia-50 text-fuchsia-600",
      accentDark: "bg-fuchsia-500 text-white"
    },
    description: "Machine learning research and applications",
    category: "technology"
  },
  cybersecurity: {
    url: "https://redlib.catsarch.com/r/cybersecurity/top?t=day",
    name: "Cybersecurity",
    emoji: "🔒",
    color: {
      gradient: "from-gray-700 to-gray-900",
      accentLight: "bg-gray-50 text-gray-700",
      accentDark: "bg-gray-700 text-white"
    },
    description: "Cybersecurity news and discussions",
    category: "technology"
  },
  apple: {
    url: "https://redlib.catsarch.com/r/apple/top?t=day",
    name: "Apple",
    emoji: "🍎",
    color: {
      gradient: "from-gray-800 to-gray-900",
      accentLight: "bg-gray-50 text-gray-800",
      accentDark: "bg-gray-800 text-white"
    },
    description: "Apple ecosystem news and updates",
    category: "technology"
  },
  android: {
    url: "https://redlib.catsarch.com/r/android/top?t=day",
    name: "Android",
    emoji: "🤖",
    color: {
      gradient: "from-green-600 to-emerald-700",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-600 text-white"
    },
    description: "Android ecosystem news and updates",
    category: "technology"
  },
  homeautomation: {
    url: "https://redlib.catsarch.com/r/homeautomation/top?t=week",
    name: "Home Automation",
    emoji: "🏠",
    color: {
      gradient: "from-amber-500 to-yellow-600",
      accentLight: "bg-amber-50 text-amber-600",
      accentDark: "bg-amber-500 text-white"
    },
    description: "Smart home and automation trends",
    category: "technology"
  },
  cloudcomputing: {
    url: "https://redlib.catsarch.com/r/aws/top?t=week",
    name: "Cloud Computing",
    emoji: "☁️",
    color: {
      gradient: "from-blue-600 to-sky-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "Cloud computing and AWS discussions",
    category: "technology"
  },
  devops: {
    url: "https://redlib.catsarch.com/r/devops/top?t=week",
    name: "DevOps",
    emoji: "🔄",
    color: {
      gradient: "from-indigo-600 to-purple-700",
      accentLight: "bg-indigo-50 text-indigo-600",
      accentDark: "bg-indigo-600 text-white"
    },
    description: "DevOps practices and tools",
    category: "technology"
  },
  javascript: {
    url: "https://redlib.catsarch.com/r/javascript/top?t=week",
    name: "JavaScript",
    emoji: "🟨",
    color: {
      gradient: "from-yellow-500 to-amber-600",
      accentLight: "bg-yellow-50 text-yellow-600",
      accentDark: "bg-yellow-500 text-white"
    },
    description: "JavaScript development and news",
    category: "technology"
  },
  python: {
    url: "https://redlib.catsarch.com/r/Python/top?t=week",
    name: "Python",
    emoji: "🐍",
    color: {
      gradient: "from-blue-500 to-indigo-600",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-500 text-white"
    },
    description: "Python programming and news",
    category: "technology"
  },
  rust: {
    url: "https://redlib.catsarch.com/r/rust/top?t=week",
    name: "Rust",
    emoji: "🦀",
    color: {
      gradient: "from-orange-600 to-red-700",
      accentLight: "bg-orange-50 text-orange-600",
      accentDark: "bg-orange-600 text-white"
    },
    description: "Rust programming language",
    category: "technology"
  },
  golang: {
    url: "https://redlib.catsarch.com/r/golang/top?t=week",
    name: "Go",
    emoji: "🐹",
    color: {
      gradient: "from-cyan-500 to-blue-600",
      accentLight: "bg-cyan-50 text-cyan-600",
      accentDark: "bg-cyan-500 text-white"
    },
    description: "Go programming language",
    category: "technology"
  },
  gamedev: {
    url: "https://redlib.catsarch.com/r/gamedev/top?t=week",
    name: "Game Development",
    emoji: "🎲",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Game development discussions",
    category: "technology"
  },
  robotics: {
    url: "https://redlib.catsarch.com/r/robotics/top?t=week",
    name: "Robotics",
    emoji: "🤖",
    color: {
      gradient: "from-gray-700 to-gray-800",
      accentLight: "bg-gray-50 text-gray-700",
      accentDark: "bg-gray-700 text-white"
    },
    description: "Robotics and automation",
    category: "technology"
  },

  // Business Category
  wallstreetbets: {
    url: "https://redlib.catsarch.com/r/wallstreetbets/top?t=day",
    name: "WallStreetBets",
    emoji: "📈",
    color: {
      gradient: "from-emerald-500 to-green-600",
      accentLight: "bg-emerald-50 text-emerald-600",
      accentDark: "bg-emerald-500 text-white"
    },
    description: "Stock market and trading discussions",
    category: "business"
  },
  cryptocurrency: {
    url: "https://redlib.catsarch.com/r/cryptocurrency/top?t=day",
    name: "Cryptocurrency",
    emoji: "₿",
    color: {
      gradient: "from-orange-500 to-amber-600",
      accentLight: "bg-orange-50 text-orange-600",
      accentDark: "bg-orange-500 text-white"
    },
    description: "Cryptocurrency news and analysis",
    category: "business"
  },
  startups: {
    url: "https://redlib.catsarch.com/r/startups/top?t=week",
    name: "Startups",
    emoji: "🚀",
    color: {
      gradient: "from-pink-500 to-rose-600",
      accentLight: "bg-pink-50 text-pink-600",
      accentDark: "bg-pink-500 text-white"
    },
    description: "Startup news and entrepreneurship",
    category: "business"
  },
  stocks: {
    url: "https://redlib.catsarch.com/r/stocks/top?t=day",
    name: "Stocks",
    emoji: "📊",
    color: {
      gradient: "from-blue-600 to-indigo-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "Stock market analysis and news",
    category: "business"
  },
  entrepreneur: {
    url: "https://redlib.catsarch.com/r/Entrepreneur/top?t=week",
    name: "Entrepreneur",
    emoji: "💼",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Entrepreneurship and business discussions",
    category: "business"
  },
  economics: {
    url: "https://redlib.catsarch.com/r/Economics/top?t=day",
    name: "Economics",
    emoji: "📉",
    color: {
      gradient: "from-teal-600 to-green-700",
      accentLight: "bg-teal-50 text-teal-600",
      accentDark: "bg-teal-600 text-white"
    },
    description: "Economic news and analysis",
    category: "business"
  },
  marketing: {
    url: "https://redlib.catsarch.com/r/marketing/top?t=week",
    name: "Marketing",
    emoji: "📢",
    color: {
      gradient: "from-red-600 to-rose-700",
      accentLight: "bg-red-50 text-red-600",
      accentDark: "bg-red-600 text-white"
    },
    description: "Marketing strategies and trends",
    category: "business"
  },
  investing: {
    url: "https://redlib.catsarch.com/r/investing/top?t=day",
    name: "Investing",
    emoji: "💰",
    color: {
      gradient: "from-green-600 to-emerald-700",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-600 text-white"
    },
    description: "Investment strategies and news",
    category: "business"
  },
  realestate: {
    url: "https://redlib.catsarch.com/r/realestate/top?t=week",
    name: "Real Estate",
    emoji: "🏠",
    color: {
      gradient: "from-amber-600 to-orange-700",
      accentLight: "bg-amber-50 text-amber-600",
      accentDark: "bg-amber-600 text-white"
    },
    description: "Real estate market trends",
    category: "business"
  },
  sales: {
    url: "https://redlib.catsarch.com/r/sales/top?t=week",
    name: "Sales",
    emoji: "🤝",
    color: {
      gradient: "from-blue-600 to-indigo-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "Sales strategies and techniques",
    category: "business"
  },
  smallbusiness: {
    url: "https://redlib.catsarch.com/r/smallbusiness/top?t=week",
    name: "Small Business",
    emoji: "🏪",
    color: {
      gradient: "from-teal-600 to-green-700",
      accentLight: "bg-teal-50 text-teal-600",
      accentDark: "bg-teal-600 text-white"
    },
    description: "Small business discussions",
    category: "business"
  },
  digitalnomad: {
    url: "https://redlib.catsarch.com/r/digitalnomad/top?t=week",
    name: "Digital Nomad",
    emoji: "🌍",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Digital nomad lifestyle",
    category: "business"
  },

  // Science Category
  science: {
    url: "https://redlib.catsarch.com/r/science/top?t=day",
    name: "Science",
    emoji: "🔬",
    color: {
      gradient: "from-green-500 to-teal-600",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-500 text-white"
    },
    description: "Latest scientific research and discoveries",
    category: "science"
  },
  space: {
    url: "https://redlib.catsarch.com/r/space/top?t=day",
    name: "Space",
    emoji: "🚀",
    color: {
      gradient: "from-slate-600 to-gray-900",
      accentLight: "bg-slate-50 text-slate-600",
      accentDark: "bg-slate-600 text-white"
    },
    description: "Space exploration and astronomy",
    category: "science"
  },
  futurology: {
    url: "https://redlib.catsarch.com/r/Futurology/top?t=day",
    name: "Futurology",
    emoji: "🔮",
    color: {
      gradient: "from-violet-500 to-purple-600",
      accentLight: "bg-violet-50 text-violet-600",
      accentDark: "bg-violet-500 text-white"
    },
    description: "Future technology and science",
    category: "science"
  },
  physics: {
    url: "https://redlib.catsarch.com/r/Physics/top?t=week",
    name: "Physics",
    emoji: "⚛️",
    color: {
      gradient: "from-blue-700 to-indigo-800",
      accentLight: "bg-blue-50 text-blue-700",
      accentDark: "bg-blue-700 text-white"
    },
    description: "Physics research and discussions",
    category: "science"
  },
  biology: {
    url: "https://redlib.catsarch.com/r/biology/top?t=week",
    name: "Biology",
    emoji: "🧬",
    color: {
      gradient: "from-green-600 to-emerald-700",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-600 text-white"
    },
    description: "Biology research and discoveries",
    category: "science"
  },
  chemistry: {
    url: "https://redlib.catsarch.com/r/chemistry/top?t=week",
    name: "Chemistry",
    emoji: "⚗️",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Chemistry research and discussions",
    category: "science"
  },
  nasa: {
    url: "https://redlib.catsarch.com/r/nasa/top?t=day",
    name: "NASA",
    emoji: "🛸",
    color: {
      gradient: "from-blue-800 to-indigo-900",
      accentLight: "bg-blue-50 text-blue-800",
      accentDark: "bg-blue-800 text-white"
    },
    description: "NASA news and space exploration",
    category: "science"
  },
  astronomy: {
    url: "https://redlib.catsarch.com/r/Astronomy/top?t=day",
    name: "Astronomy",
    emoji: "🔭",
    color: {
      gradient: "from-indigo-800 to-purple-900",
      accentLight: "bg-indigo-50 text-indigo-800",
      accentDark: "bg-indigo-800 text-white"
    },
    description: "Astronomy discoveries and discussions",
    category: "science"
  },
  quantum: {
    url: "https://redlib.catsarch.com/r/QuantumComputing/top?t=week",
    name: "Quantum Computing",
    emoji: "⚛️",
    color: {
      gradient: "from-violet-700 to-purple-800",
      accentLight: "bg-violet-50 text-violet-700",
      accentDark: "bg-violet-700 text-white"
    },
    description: "Quantum computing developments",
    category: "science"
  },
  neuroscience: {
    url: "https://redlib.catsarch.com/r/neuroscience/top?t=week",
    name: "Neuroscience",
    emoji: "🧠",
    color: {
      gradient: "from-pink-600 to-rose-700",
      accentLight: "bg-pink-50 text-pink-600",
      accentDark: "bg-pink-600 text-white"
    },
    description: "Neuroscience research",
    category: "science"
  },
  genetics: {
    url: "https://redlib.catsarch.com/r/genetics/top?t=week",
    name: "Genetics",
    emoji: "🧬",
    color: {
      gradient: "from-green-700 to-emerald-800",
      accentLight: "bg-green-50 text-green-700",
      accentDark: "bg-green-700 text-white"
    },
    description: "Genetics research and discoveries",
    category: "science"
  },
  environment: {
    url: "https://redlib.catsarch.com/r/environment/top?t=day",
    name: "Environment",
    emoji: "🌍",
    color: {
      gradient: "from-emerald-600 to-green-700",
      accentLight: "bg-emerald-50 text-emerald-600",
      accentDark: "bg-emerald-600 text-white"
    },
    description: "Environmental science and news",
    category: "science"
  },

  // Entertainment Category
  gaming: {
    url: "https://redlib.catsarch.com/r/gaming/top?t=day",
    name: "Gaming",
    emoji: "🎮",
    color: {
      gradient: "from-indigo-600 to-purple-700",
      accentLight: "bg-indigo-50 text-indigo-600",
      accentDark: "bg-indigo-600 text-white"
    },
    description: "Gaming industry news and trends",
    category: "entertainment"
  },
  movies: {
    url: "https://redlib.catsarch.com/r/movies/top?t=day",
    name: "Movies",
    emoji: "🎬",
    color: {
      gradient: "from-red-600 to-rose-700",
      accentLight: "bg-red-50 text-red-600",
      accentDark: "bg-red-600 text-white"
    },
    description: "Movie industry news and discussions",
    category: "entertainment"
  },
  television: {
    url: "https://redlib.catsarch.com/r/television/top?t=day",
    name: "Television",
    emoji: "📺",
    color: {
      gradient: "from-blue-600 to-sky-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "TV industry news and discussions",
    category: "entertainment"
  },
  anime: {
    url: "https://redlib.catsarch.com/r/anime/top?t=day",
    name: "Anime",
    emoji: "🎌",
    color: {
      gradient: "from-pink-600 to-rose-700",
      accentLight: "bg-pink-50 text-pink-600",
      accentDark: "bg-pink-600 text-white"
    },
    description: "Anime industry news and trends",
    category: "entertainment"
  },
  esports: {
    url: "https://redlib.catsarch.com/r/esports/top?t=day",
    name: "Esports",
    emoji: "🎮",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Esports news and events",
    category: "entertainment"
  },
  streaming: {
    url: "https://redlib.catsarch.com/r/Twitch/top?t=day",
    name: "Streaming",
    emoji: "📺",
    color: {
      gradient: "from-violet-600 to-purple-700",
      accentLight: "bg-violet-50 text-violet-600",
      accentDark: "bg-violet-600 text-white"
    },
    description: "Streaming industry trends",
    category: "entertainment"
  },
  music: {
    url: "https://redlib.catsarch.com/r/Music/top?t=day",
    name: "Music",
    emoji: "🎵",
    color: {
      gradient: "from-pink-600 to-rose-700",
      accentLight: "bg-pink-50 text-pink-600",
      accentDark: "bg-pink-600 text-white"
    },
    description: "Music industry news",
    category: "entertainment"
  },
  podcasts: {
    url: "https://redlib.catsarch.com/r/podcasts/top?t=week",
    name: "Podcasts",
    emoji: "🎙️",
    color: {
      gradient: "from-green-600 to-emerald-700",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-600 text-white"
    },
    description: "Podcast industry trends",
    category: "entertainment"
  },

  // Lifestyle Category
  fitness: {
    url: "https://redlib.catsarch.com/r/Fitness/top?t=week",
    name: "Fitness",
    emoji: "💪",
    color: {
      gradient: "from-emerald-600 to-green-700",
      accentLight: "bg-emerald-50 text-emerald-600",
      accentDark: "bg-emerald-600 text-white"
    },
    description: "Fitness trends and discussions",
    category: "lifestyle"
  },
  food: {
    url: "https://redlib.catsarch.com/r/food/top?t=day",
    name: "Food",
    emoji: "🍳",
    color: {
      gradient: "from-orange-600 to-amber-700",
      accentLight: "bg-orange-50 text-orange-600",
      accentDark: "bg-orange-600 text-white"
    },
    description: "Food trends and culinary arts",
    category: "lifestyle"
  },
  travel: {
    url: "https://redlib.catsarch.com/r/travel/top?t=week",
    name: "Travel",
    emoji: "✈️",
    color: {
      gradient: "from-blue-600 to-sky-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "Travel trends and destinations",
    category: "lifestyle"
  },
  fashion: {
    url: "https://redlib.catsarch.com/r/malefashionadvice/top?t=week",
    name: "Fashion",
    emoji: "👔",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Fashion trends and advice",
    category: "lifestyle"
  },
  cooking: {
    url: "https://redlib.catsarch.com/r/Cooking/top?t=week",
    name: "Cooking",
    emoji: "👨‍🍳",
    color: {
      gradient: "from-orange-600 to-red-700",
      accentLight: "bg-orange-50 text-orange-600",
      accentDark: "bg-orange-600 text-white"
    },
    description: "Cooking trends and techniques",
    category: "lifestyle"
  },
  gardening: {
    url: "https://redlib.catsarch.com/r/gardening/top?t=week",
    name: "Gardening",
    emoji: "🌱",
    color: {
      gradient: "from-green-600 to-emerald-700",
      accentLight: "bg-green-50 text-green-600",
      accentDark: "bg-green-600 text-white"
    },
    description: "Gardening trends and tips",
    category: "lifestyle"
  },
  sustainability: {
    url: "https://redlib.catsarch.com/r/sustainability/top?t=week",
    name: "Sustainability",
    emoji: "♻️",
    color: {
      gradient: "from-teal-600 to-green-700",
      accentLight: "bg-teal-50 text-teal-600",
      accentDark: "bg-teal-600 text-white"
    },
    description: "Sustainable living trends",
    category: "lifestyle"
  },
  mindfulness: {
    url: "https://redlib.catsarch.com/r/Mindfulness/top?t=week",
    name: "Mindfulness",
    emoji: "🧘",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Mindfulness and meditation",
    category: "lifestyle"
  },
  productivity: {
    url: "https://redlib.catsarch.com/r/productivity/top?t=week",
    name: "Productivity",
    emoji: "⚡",
    color: {
      gradient: "from-yellow-600 to-amber-700",
      accentLight: "bg-yellow-50 text-yellow-600",
      accentDark: "bg-yellow-600 text-white"
    },
    description: "Productivity methods and tools",
    category: "lifestyle"
  },

  // Creative Category
  design: {
    url: "https://redlib.catsarch.com/r/Design/top?t=day",
    name: "Design",
    emoji: "🎨",
    color: {
      gradient: "from-rose-500 to-pink-600",
      accentLight: "bg-rose-50 text-rose-600",
      accentDark: "bg-rose-500 text-white"
    },
    description: "Design trends and inspiration",
    category: "creative"
  },
  dataisbeautiful: {
    url: "https://redlib.catsarch.com/r/dataisbeautiful/top?t=day",
    name: "Data Visualization",
    emoji: "📊",
    color: {
      gradient: "from-cyan-500 to-blue-600",
      accentLight: "bg-cyan-50 text-cyan-600",
      accentDark: "bg-cyan-500 text-white"
    },
    description: "Data visualization and analysis",
    category: "creative"
  },
  art: {
    url: "https://redlib.catsarch.com/r/Art/top?t=day",
    name: "Art",
    emoji: "🖼️",
    color: {
      gradient: "from-violet-600 to-purple-700",
      accentLight: "bg-violet-50 text-violet-600",
      accentDark: "bg-violet-600 text-white"
    },
    description: "Art trends and creations",
    category: "creative"
  },
  photography: {
    url: "https://redlib.catsarch.com/r/photography/top?t=day",
    name: "Photography",
    emoji: "📸",
    color: {
      gradient: "from-gray-700 to-gray-800",
      accentLight: "bg-gray-50 text-gray-700",
      accentDark: "bg-gray-700 text-white"
    },
    description: "Photography trends and techniques",
    category: "creative"
  },
  architecture: {
    url: "https://redlib.catsarch.com/r/architecture/top?t=day",
    name: "Architecture",
    emoji: "🏛️",
    color: {
      gradient: "from-stone-600 to-stone-700",
      accentLight: "bg-stone-50 text-stone-600",
      accentDark: "bg-stone-600 text-white"
    },
    description: "Architecture trends and designs",
    category: "creative"
  },
  graphicdesign: {
    url: "https://redlib.catsarch.com/r/graphic_design/top?t=day",
    name: "Graphic Design",
    emoji: "🎨",
    color: {
      gradient: "from-pink-600 to-rose-700",
      accentLight: "bg-pink-50 text-pink-600",
      accentDark: "bg-pink-600 text-white"
    },
    description: "Graphic design trends",
    category: "creative"
  },
  uxdesign: {
    url: "https://redlib.catsarch.com/r/UXDesign/top?t=day",
    name: "UX Design",
    emoji: "🎯",
    color: {
      gradient: "from-blue-600 to-indigo-700",
      accentLight: "bg-blue-50 text-blue-600",
      accentDark: "bg-blue-600 text-white"
    },
    description: "UX design trends",
    category: "creative"
  },
  animation: {
    url: "https://redlib.catsarch.com/r/animation/top?t=day",
    name: "Animation",
    emoji: "🎬",
    color: {
      gradient: "from-purple-600 to-indigo-700",
      accentLight: "bg-purple-50 text-purple-600",
      accentDark: "bg-purple-600 text-white"
    },
    description: "Animation trends and techniques",
    category: "creative"
  },
  filmmaking: {
    url: "https://redlib.catsarch.com/r/Filmmakers/top?t=day",
    name: "Filmmaking",
    emoji: "🎥",
    color: {
      gradient: "from-red-600 to-rose-700",
      accentLight: "bg-red-50 text-red-600",
      accentDark: "bg-red-600 text-white"
    },
    description: "Filmmaking trends and techniques",
    category: "creative"
  },
  writing: {
    url: "https://redlib.catsarch.com/r/writing/top?t=day",
    name: "Writing",
    emoji: "✍️",
    color: {
      gradient: "from-stone-600 to-gray-700",
      accentLight: "bg-stone-50 text-stone-600",
      accentDark: "bg-stone-600 text-white"
    },
    description: "Writing trends and techniques",
    category: "creative"
  }
};

// Group subreddits by category
export const CATEGORIES = {
  technology: "Technology & Programming",
  business: "Business & Finance",
  science: "Science & Research",
  entertainment: "Entertainment & Gaming",
  lifestyle: "Lifestyle & Culture",
  creative: "Design & Creativity"
};

export const getSubredditsByCategory = (category: keyof typeof CATEGORIES) => {
  return Object.entries(SUBREDDITS)
    .filter(([, config]) => config.category === category)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}; 