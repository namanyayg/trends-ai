import { TrendsData } from '../types/trends';

export async function getTrendsData(): Promise<{ success: boolean; data: TrendsData[] }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://trends.nmn.gl';
  const res = await fetch(`${baseUrl}/api/trends`, { 
    next: { revalidate: 3600 },
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch trends');
  const response = await res.json();

  // Dedupe trends by category and get latest for each
  const latestByCategory = response.data.reduce((acc: TrendsData[], curr: TrendsData) => {
    const existingIndex = acc.findIndex(item => item.category === curr.category);
    if (existingIndex === -1) {
      acc.push(curr);
    } else if (new Date(curr.timestamp) > new Date(acc[existingIndex].timestamp)) {
      acc[existingIndex] = curr;
    }
    return acc;
  }, []);

  return {
    success: response.success,
    data: latestByCategory
  };
}