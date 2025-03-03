import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, message, from } = await request.json();

    // Validate inputs
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: from === 'contact' 
        ? 'contact@cakepopsbymaddy.com' 
        : 'noreply@cakepopsbymaddy.com',
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${message.replace(/\n/g, '<br>')}
          <br><br>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Cake Pops by Maddy<br>
            <a href="https://cakepopsbymaddy.com" style="color: #c25a7e; text-decoration: none;">
              cakepopsbymaddy.com
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 