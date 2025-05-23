import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/lib/db/mongodb';
import Contact from '@/models/Contact';

const resend = new Resend(process.env.RESEND_API_KEY);

// Configure maximum file size (20MB)
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ImageAttachment {
  filename: string;
  content: Buffer;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const images = formData.getAll('images') as File[];

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create contact record without images
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    // Process images if any
    let imageAttachments: ImageAttachment[] = [];
    if (images.length > 0) {
      imageAttachments = await Promise.all(
        images.map(async (file) => {
          const buffer = await file.arrayBuffer();
          return {
            filename: file.name,
            content: Buffer.from(buffer)
          };
        })
      );
    }

    // Send email notification with attachments
    const { data, error } = await resend.emails.send({
      from: 'contact@cakepopsbymaddy.com',
      to: 'contact@cakepopsbymaddy.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          ${images.length > 0 ? `<p><strong>Images:</strong> ${images.length} image(s) attached</p>` : ''}
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
      attachments: imageAttachments
    });

    if (error) {
      console.error('Resend error:', error);
      // Don't return error to user, just log it
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error processing contact form. Please try again.' },
      { status: 500 }
    );
  }
} 