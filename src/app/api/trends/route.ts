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
      const trendsBlob = blobs.find(blob => blob.pathname === `trends-${category.toLowerCase()}.json`);
      
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
      // Return all categories, ensuring one of each type
      const categories = ['technology', 'cryptocurrency', 'finance'];
      const trendBlobs = categories.map(cat => {
        // Get all blobs for this category
        const categoryBlobs = blobs.filter(blob => 
          blob.pathname === `trends-${cat}.json`
        );
        // Sort by uploadedAt to get the newest
        categoryBlobs.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        // Return the newest one
        return categoryBlobs[0];
      }).filter(Boolean);

      if (trendBlobs.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No trends data found' },
          { status: 404 }
        );
      }

      const allTrends = await Promise.all(
        trendBlobs.map(async (blob) => {
          const response = await fetch(blob!.url);
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