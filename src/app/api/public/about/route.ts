import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import About from '@/models/About';

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne().select('title description image');
    return NextResponse.json(about || {});
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching about' }, { status: 500 });
  }
} 