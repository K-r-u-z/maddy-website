import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB, fetching menu items...');
    
    const items = await MenuItem.find({ isVisible: true }).sort({ title: 1 });
    console.log('Menu items fetched:', items.length);
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in menu route:', error);
    return NextResponse.json(
      { error: 'Error fetching menu items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 