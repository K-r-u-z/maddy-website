import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import MenuItem from '@/models/MenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface OldMenuItem {
  _id: string;
  price?: string;
  quantity?: string;
  [key: string]: any;
}

async function migratePriceQuantities() {
  await connectDB();
  
  const items = await MenuItem.find({}).lean() as OldMenuItem[];
  console.log('Found items:', items);

  let migratedCount = 0;
  
  for (const item of items) {
    try {
      const priceQuantities = [{
        price: String(item.price || '0'),
        quantity: String(item.quantity || '1')
      }];

      const updateResult = await MenuItem.findByIdAndUpdate(
        item._id,
        { 
          $set: { priceQuantities },
          $unset: { price: "", quantity: "" }
        },
        { new: true }
      );

      migratedCount++;
    } catch (error) {
      console.error('Error updating item:', item._id, error);
    }
  }
  
  const verifyItems = await MenuItem.find({}).lean();
  
  return {
    message: 'Migration completed',
    itemCount: items.length,
    migratedCount,
    items: verifyItems
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await migratePriceQuantities();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error migrating menu items:', error);
    return NextResponse.json(
      { error: 'Error migrating menu items', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
} 