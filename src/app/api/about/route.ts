import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import About from '@/models/About';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne();
    return NextResponse.json(about || {});
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json({ error: 'Error fetching about' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find existing about or create new one
    const existingAbout = await About.findOne();
    let about;

    if (existingAbout) {
      about = await About.findByIdAndUpdate(existingAbout._id, data, { new: true });
    } else {
      about = await About.create(data);
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json({ error: 'Error updating about' }, { status: 500 });
  }
} 