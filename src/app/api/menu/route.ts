import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    console.log('Creating new item with data:', data);

    // Create new item with explicit fields
    const newItem = new MenuItem({
      title: data.title,
      description: data.description,
      price: data.price,
      quantity: data.quantity || '1',
      image: data.image || '',
      isVisible: data.isVisible ?? true,
      isSoldOut: data.isSoldOut ?? false,
      showPrice: data.showPrice ?? true
    });

    console.log('New item before save:', newItem);
    const savedItem = await newItem.save();
    console.log('Saved item:', savedItem);

    return NextResponse.json(savedItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Error creating menu item' },
      { status: 500 }
    );
  }
} 