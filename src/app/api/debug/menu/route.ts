import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find({}).select('title isVisible');
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
} 