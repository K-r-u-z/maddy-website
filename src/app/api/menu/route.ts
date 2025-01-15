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
    
    // Validate required fields
    const missingFields = [];
    if (!data.title) missingFields.push('title');
    if (!data.description) missingFields.push('description');
    if (!data.price) missingFields.push('price');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create the item
    try {
      const item = await MenuItem.create({
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price.trim(),
        image: data.image || '',
        isVisible: data.isVisible ?? true,
        isSoldOut: data.isSoldOut ?? false,
        showPrice: data.showPrice ?? true
      });
      
      return NextResponse.json(item, { status: 201 });
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database error: ' + (dbError instanceof Error ? dbError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 