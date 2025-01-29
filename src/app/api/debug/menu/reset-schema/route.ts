import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    
    // Get all existing items
    const existingItems = await MenuItem.find({});
    
    // Drop the collection
    await MenuItem.collection.drop();
    
    // Add quantity field to all items
    const itemsWithQuantity = existingItems.map(item => ({
      ...item.toObject(),
      quantity: '1'
    }));
    
    // Reinsert all items with the new schema
    await MenuItem.insertMany(itemsWithQuantity);
    
    return NextResponse.json({ 
      message: 'Menu collection reset with new schema',
      itemCount: itemsWithQuantity.length
    });
  } catch (error) {
    console.error('Error resetting schema:', error);
    return NextResponse.json(
      { error: 'Error resetting schema' }, 
      { status: 500 }
    );
  }
} 