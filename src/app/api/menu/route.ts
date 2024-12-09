import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find().sort({ title: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Validate required fields
    const missingFields = [];
    if (!data.title) missingFields.push('title');
    if (!data.description) missingFields.push('description');
    if (!data.price) missingFields.push('price');
    if (!data.image) missingFields.push('image');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof data.title !== 'string' || typeof data.description !== 'string' || 
        typeof data.price !== 'string' || typeof data.image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data types for one or more fields' },
        { status: 400 }
      );
    }

    // Create the item
    const item = await MenuItem.create({
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price.trim(),
      image: data.image
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Error creating menu item' }, { status: 500 });
  }
} 