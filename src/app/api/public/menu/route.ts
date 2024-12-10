import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find({ isVisible: true }).sort({ title: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 