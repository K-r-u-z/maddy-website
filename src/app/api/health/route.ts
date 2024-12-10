import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('MongoDB connection successful');
    return NextResponse.json({ status: 'healthy', message: 'Database connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 