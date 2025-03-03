import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    // Connect to production database
    const prodUri = process.env.MONGODB_URI?.replace('/test', '/maddy-cakepops');
    if (!prodUri) {
      throw new Error('Production MongoDB URI not found');
    }

    // Connect to production DB
    await mongoose.connect(prodUri);
    console.log('Connected to production database');
    
    // Update all menu items that don't have a quantity field
    const result = await MenuItem.updateMany(
      { quantity: { $exists: false } },
      { $set: { quantity: '1' } }
    );

    console.log('Migration result:', result);
    
    return NextResponse.json({ 
      message: 'Added quantity field to menu items in production database',
      result 
    });
  } catch (error) {
    console.error('Error updating menu items:', error);
    return NextResponse.json(
      { error: 'Error updating menu items' }, 
      { status: 500 }
    );
  } finally {
    // Close the production database connection
    await mongoose.connection.close();
  }
}

// Keep the POST handler as well
export { GET as POST }; 