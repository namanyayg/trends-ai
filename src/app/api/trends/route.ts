import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // List blobs to get the latest trends file
    const { blobs } = await list();
    const trendsBlob = blobs.find(blob => blob.pathname === 'trends.json');

    if (!trendsBlob) {
      return NextResponse.json(
        { success: false, error: 'No trends data found' },
        { status: 404 }
      );
    }

    // Fetch the JSON content
    const response = await fetch(trendsBlob.url);
    const trends = await response.json();

    return NextResponse.json({ 
      success: true, 
      data: trends 
    });

  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
} 