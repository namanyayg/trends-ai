import { Suspense } from 'react';
import { TrendsClient } from './trends-client';
import { getTrendsData } from './utils/api';

export const dynamic = 'force-dynamic';

// Main page component (Server Component)
export default async function Home() {
  const { data: trendsData } = await getTrendsData();
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading trends...</p>
        </div>
      </div>
    }>
      <TrendsClient trendsData={trendsData} />
    </Suspense>
  );
}
