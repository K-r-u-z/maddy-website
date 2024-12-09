import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OrderStep from '@/models/OrderStep';
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

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await connectDB();
    const data = await request.json();

    // Find existing item first
    const existingItem = await OrderStep.findById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Order step not found' }, { status: 404 });
    }

    // Merge existing data with updates
    const updatedData = {
      title: data.title || existingItem.title,
      description: data.description || existingItem.description,
      step: data.step || existingItem.step,
      stepNumber: data.stepNumber || existingItem.stepNumber
    };

    const item = await OrderStep.findByIdAndUpdate(id, updatedData, { new: true });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating order step:', error);
    return NextResponse.json({ error: 'Error updating order step' }, { status: 500 });
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
    const item = await OrderStep.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Order step not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order step deleted successfully' });
  } catch (error) {
    console.error('Error deleting order step:', error);
    return NextResponse.json({ error: 'Error deleting order step' }, { status: 500 });
  }
} 