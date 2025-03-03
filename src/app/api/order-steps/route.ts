import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OrderStep from '@/models/OrderStep';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const step = await OrderStep.create(data);
    return NextResponse.json(step);
  } catch (error) {
    console.error('Error creating order step:', error);
    return NextResponse.json({ error: 'Error creating order step' }, { status: 500 });
  }
} 