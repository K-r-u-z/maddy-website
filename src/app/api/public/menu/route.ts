import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find().sort({ title: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
} 