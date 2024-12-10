import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Print the MongoDB URI (with password redacted)
    const uri = process.env.MONGODB_URI || '';
    const redactedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log('MongoDB URI:', redactedUri);
    
    return NextResponse.json({ 
      message: 'Test endpoint',
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
} 