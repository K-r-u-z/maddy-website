import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Username, current password, and new password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify current password
    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 