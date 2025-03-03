import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectDB();
    const adminExists = await Admin.exists({});
    
    return NextResponse.json({ exists: !!adminExists });
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 