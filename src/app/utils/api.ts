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
  return res.json();
} 