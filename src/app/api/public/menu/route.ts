import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import type { MenuItemDocument } from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    
    // Add debug log
    console.log('Fetching menu items from database');
    
    // First ensure all items have showPrice set
    await MenuItem.updateMany(
      { showPrice: { $exists: false } },
      { $set: { showPrice: true } }
    );

    // Then fetch the items
    const items = await MenuItem.find({ isVisible: true })
      .select('title description price quantity image isVisible isSoldOut showPrice')
      .sort({ title: 1 })
      .lean<MenuItemDocument[]>()
      .exec();
    
    // Add debug log
    console.log('Found items:', items);
    
    // Ensure showPrice is set in the response
    const processedItems = items.map(item => ({
      ...item,
      showPrice: item.showPrice ?? true
    }));
    
    return NextResponse.json(processedItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Error fetching menu items' },
      { status: 500 }
    );
  }
} 