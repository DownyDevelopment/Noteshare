import { NextResponse } from 'next/server';
import { MOCK_NOTES } from '@/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const faculty = searchParams.get('faculty') || '';
    const course = searchParams.get('course') || '';
    const priceType = searchParams.get('priceType') || ''; // 'free', 'premium', or ''

    let filtered = [...MOCK_NOTES];

    if (query) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.courseName.toLowerCase().includes(query) ||
          note.courseCode.toLowerCase().includes(query) ||
          note.topic.toLowerCase().includes(query)
      );
    }

    if (faculty && faculty !== 'All') {
      filtered = filtered.filter((note) => note.faculty === faculty);
    }

    if (course && course !== 'All') {
      filtered = filtered.filter((note) => note.courseName === course);
    }

    if (priceType === 'free') {
      filtered = filtered.filter((note) => !note.isPremium);
    } else if (priceType === 'premium') {
      filtered = filtered.filter((note) => note.isPremium);
    }

    // Simulate database delay of 150ms
    await new Promise((resolve) => setTimeout(resolve, 150));

    return NextResponse.json({ success: true, notes: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side validation
    if (!body.title || !body.courseName || !body.courseCode || !body.faculty) {
      return NextResponse.json(
        { success: false, error: 'Mandatory fields are missing' },
        { status: 400 }
      );
    }

    if (body.isPremium && (!body.price || body.price <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Premium notes must have a price greater than 0' },
        { status: 400 }
      );
    }

    // Return the created note mock data
    return NextResponse.json({
      success: true,
      message: 'Note uploaded successfully',
      note: {
        id: `note-${Date.now()}`,
        ...body,
        rating: 5.0,
        reviewsCount: 0,
        views: 0,
        downloads: 0,
        dateUploaded: new Date().toISOString().slice(0, 10),
        reviews: []
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing request' },
      { status: 500 }
    );
  }
}
