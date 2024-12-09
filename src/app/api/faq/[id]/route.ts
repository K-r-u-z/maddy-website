import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import FAQ from '@/models/FAQ';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const existingItem = await FAQ.findById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    // Merge existing data with updates
    const updatedData = {
      question: data.question || existingItem.question,
      answer: data.answer || existingItem.answer,
      order: data.order || existingItem.order
    };

    const item = await FAQ.findByIdAndUpdate(id, updatedData, { new: true });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Error updating FAQ' }, { status: 500 });
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
    const item = await FAQ.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Error deleting FAQ' }, { status: 500 });
  }
} 