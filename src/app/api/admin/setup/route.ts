import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if any admin already exists
    const adminExists = await Admin.exists({});
    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();

    return NextResponse.json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 