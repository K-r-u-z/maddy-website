import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OrderStep from '@/models/OrderStep';

export async function GET() {
  try {
    await connectDB();
    const steps = await OrderStep.find().sort({ stepNumber: 1 });
    return NextResponse.json(steps);
  } catch (error) {
    console.error('Error fetching order steps:', error);
    return NextResponse.json({ error: 'Error fetching order steps' }, { status: 500 });
  }
} 