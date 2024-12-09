import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';

export async function POST() {
  try {
    await connectDB();
    
    const password = process.env.ADMIN_PASSWORD as string;
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });

    if (existingAdmin) {
      existingAdmin.password = password;
      await existingAdmin.save();
    } else {
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: password,
      });
    }

    return NextResponse.json({ message: 'Admin user setup successful' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Error setting up admin user' }, { status: 500 });
  }
} 