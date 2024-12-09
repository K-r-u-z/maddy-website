import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import FAQ from '@/models/FAQ';

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find().sort({ order: 1 });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Error fetching FAQs' }, { status: 500 });
  }
} 