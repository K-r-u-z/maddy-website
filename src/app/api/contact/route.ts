import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const images = formData.getAll('images') as File[];

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create image attachments HTML if there are images
    let imagesHtml = '';
    if (images.length > 0) {
      imagesHtml = `
        <h3>Reference Images</h3>
        <p>The user has attached ${images.length} reference image(s). Please check your email for the attachments.</p>
      `;
    }

    // Convert files to buffers
    const attachments = await Promise.all(
      images.map(async (file) => ({
        filename: file.name,
        content: await fileToBuffer(file)
      }))
    );

    const { data, error } = await resend.emails.send({
      from: 'noreply@cakepopsbymaddy.com',
      to: 'cakepopsbymaddy@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ${imagesHtml}
      `,
      attachments
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
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 