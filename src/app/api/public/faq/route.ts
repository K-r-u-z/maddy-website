import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import FAQ from '@/models/FAQ';

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find().sort({ order: 1 });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 