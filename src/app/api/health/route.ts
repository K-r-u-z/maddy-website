import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'healthy' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 });
  }
} 