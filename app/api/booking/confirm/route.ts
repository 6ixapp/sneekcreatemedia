import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Generate booking reference if not provided
    if (!bookingData.bookingRef) {
      bookingData.bookingRef = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Validate required fields
    const requiredFields = ['service', 'date', 'time', 'contact'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate contact information
    if (!bookingData.contact.name || !bookingData.contact.email) {
      return NextResponse.json(
        { error: 'Contact name and email are required' },
        { status: 400 }
      );
    }

    // Send confirmation emails
    const emailResult = await sendBookingConfirmationEmail(bookingData);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send confirmation emails', details: emailResult.error },
        { status: 500 }
      );
    }

    // Here you could also save to database if needed
    // await saveBookingToDatabase(bookingData);

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed and emails sent successfully',
      bookingRef: bookingData.bookingRef,
      emailIds: {
        customer: emailResult.customerEmailId,
        business: emailResult.businessEmailId,
      },
    });

  } catch (error) {
    console.error('Booking confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}