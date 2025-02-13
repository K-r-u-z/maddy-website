import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// Define segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectDB();
    const data = await request.json();
    console.log('Updating menu item with data:', data);

    const updateData: any = {
      title: data.title,
      description: data.description,
      image: data.image || '',
      isVisible: data.isVisible ?? true,
      isSoldOut: data.isSoldOut ?? false,
      showPrice: data.showPrice ?? true
    };

    // Handle both old and new price/quantity formats
    if (data.priceQuantities) {
      updateData.priceQuantities = data.priceQuantities;
      // Remove old fields if they exist
      updateData.$unset = { price: "", quantity: "" };
    } else if (data.price || data.quantity) {
      updateData.priceQuantities = [{
        price: data.price || '0',
        quantity: data.quantity || '1'
      }];
      // Remove old fields
      updateData.$unset = { price: "", quantity: "" };
    }

    console.log('Final update data:', updateData);

    const updatedItem = await MenuItem.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Updated item:', updatedItem);

    if (!updatedItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Error updating menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectDB();
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Error deleting menu item' }, { status: 500 });
  }
} 