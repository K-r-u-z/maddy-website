import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.url.split('/').pop();
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectDB();
    const data = await request.json();

    // Find existing item first
    const existingItem = await MenuItem.findById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Create update object with only the fields that are provided
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;
    if (data.isSoldOut !== undefined) updateData.isSoldOut = data.isSoldOut;
    if (data.showPrice !== undefined) updateData.showPrice = data.showPrice;
    
    // Handle image field specifically
    if ('image' in data) {
      updateData.image = data.image || null; // Set to null if empty string
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Error updating menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.url.split('/').pop();

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectDB();
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Error deleting menu item' }, { status: 500 });
  }
} 