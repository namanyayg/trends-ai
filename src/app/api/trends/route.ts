import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // List blobs to get the latest trends files
    const { blobs } = await list();
    
    if (category) {
      // Return specific category
      const trendsBlob = blobs.find(blob => blob.pathname === `trends-${category}.json`);
      
      if (!trendsBlob) {
        return NextResponse.json(
          { success: false, error: `No trends data found for category: ${category}` },
          { status: 404 }
        );
      }

      const response = await fetch(trendsBlob.url);
      const trends = await response.json();

      return NextResponse.json({ 
        success: true, 
        data: trends 
      });
    } else {
      // Return all categories
      const trendBlobs = blobs.filter(blob => blob.pathname.startsWith('trends-') && blob.pathname.endsWith('.json'));
      
      if (trendBlobs.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No trends data found' },
          { status: 404 }
        );
      }

      const allTrends = await Promise.all(
        trendBlobs.map(async (blob) => {
          const response = await fetch(blob.url);
          const data = await response.json();
          return data;
        })
      );

      return NextResponse.json({ 
        success: true, 
        data: allTrends 
      });
    }

  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
} 