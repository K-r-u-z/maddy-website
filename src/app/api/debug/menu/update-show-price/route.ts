import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function POST() {
  try {
    await connectDB();
    
    // First try a bulk update
    const bulkResult = await MenuItem.updateMany(
      {},  // match all documents
      { $set: { showPrice: true } },
      { upsert: false, multi: true }
    );

    // Then verify all items have been updated
    const items = await MenuItem.find({}).select('title showPrice');

    return NextResponse.json({ 
      message: 'Updated menu items',
      modifiedCount: bulkResult.modifiedCount,
      items: items.map(item => ({
        id: item._id,
        title: item.title,
        showPrice: item.showPrice
      }))
    });
  } catch (error) {
    console.error('Error updating menu items:', error);
    return NextResponse.json(
      { error: 'Error updating menu items' }, 
      { status: 500 }
    );
  }
} 