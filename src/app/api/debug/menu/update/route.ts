import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function POST() {
  try {
    await connectDB();
    await MenuItem.updateMany(
      { isVisible: { $exists: false } },
      { $set: { isVisible: true } }
    );
    return NextResponse.json({ message: 'Updated menu items' });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating menu items' }, { status: 500 });
  }
} 