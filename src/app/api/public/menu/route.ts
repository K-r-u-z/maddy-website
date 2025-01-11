import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import type { MenuItemDocument } from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    
    // First ensure all items have showPrice set
    await MenuItem.updateMany(
      { showPrice: { $exists: false } },
      { $set: { showPrice: true } }
    );

    // Then fetch the items
    const items = await MenuItem.find({ isVisible: true })
      .select('title description price image isVisible isSoldOut showPrice')
      .lean<MenuItemDocument[]>()
      .exec();
    
    // Ensure showPrice is set in the response
    const processedItems = items.map(item => ({
      ...item,
      showPrice: item.showPrice ?? true
    }));
    
    return NextResponse.json(processedItems);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 