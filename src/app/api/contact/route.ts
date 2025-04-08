import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/lib/db/mongodb';
import Contact from '@/models/Contact';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne();
    return NextResponse.json(contact || { description: 'Have a custom order request, or a a question? Send us a message, and we\'ll get back to you as soon as possible!' });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ error: 'Error fetching contact' }, { status: 500 });
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
    if (!data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find existing contact or create new one
    const existingContact = await Contact.findOne();
    let contact;

    if (existingContact) {
      contact = await Contact.findByIdAndUpdate(existingContact._id, data, { new: true });
    } else {
      contact = await Contact.create(data);
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
  }
} 