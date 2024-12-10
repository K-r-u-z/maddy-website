import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OrderStep from '@/models/OrderStep';

export async function GET() {
  try {
    await connectDB();
    const steps = await OrderStep.find().sort({ order: 1 });
    return NextResponse.json(steps);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 