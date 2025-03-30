import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/lib/models/Bookings';
import Property from '@/lib/models/Property';
import { dbConnect } from '@/lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

/**
 * GET: Fetch all bookings
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const bookings = await Booking.find().populate('propertyId').sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a new booking
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await dbConnect();

    // Validate required fields
    if (!data.propertyId || !data.name || !data.email || !data.checkIn || !data.checkOut || !data.totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property = await Property.findById(data.propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn >= checkOut) {
      return NextResponse.json({ error: 'Invalid check-in or check-out dates' }, { status: 400 });
    }

    // Generate booking date range
    const bookingDates: string[] = [];
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      bookingDates.push(d.toISOString().split('T')[0]);
    }

    // Check for availability conflicts
    const blockedDates = property.inventory.map((d: Date) => new Date(d).toISOString().split('T')[0]);
    if (bookingDates.some(date => blockedDates.includes(date))) {
      return NextResponse.json({ error: 'Property is not available for the selected dates' }, { status: 400 });
    }

    // Create new booking
    const bookingPayload = {
      propertyId: property._id,
      propertyName: property.title,
      propertyImage: property.images[0] || '/placeholder.svg',
      name: data.name,
      email: data.email,
      checkIn,
      checkOut,
      totalPrice: data.totalPrice,
      stripePaymentId: data.stripePaymentId,
      status: 'confirmed',
    };

    const newBooking = await Booking.create(bookingPayload);

    // Update property inventory
    property.inventory.push(...bookingDates.map(dateStr => new Date(dateStr)));
    property.bookings = (property.bookings || 0) + 1;
    if (property.bookings >= property.beds) {
      property.status = 'Unavailable';
    }
    await property.save();

    // Send confirmation email
    sendConfirmationEmail(bookingPayload);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Sends a booking confirmation email
 */
async function sendConfirmationEmail(booking: any) {
  try {
    await transporter.sendMail({
      from: '"TripNest" <no-reply@tripnest.com>',
      to: booking.email,
      subject: 'Booking Confirmation',
      text: `Hi ${booking.name},

Your booking for "${booking.propertyName}" from ${booking.checkIn.toLocaleDateString()} to ${booking.checkOut.toLocaleDateString()} has been confirmed.

Thank you for booking with us!

Best regards,
TRIPNEST`,
      html: `<p>Hi ${booking.name},</p>
<p>Your booking for <strong>${booking.propertyName}</strong> from <strong>${booking.checkIn.toLocaleDateString()}</strong> to <strong>${booking.checkOut.toLocaleDateString()}</strong> has been confirmed.</p>
<p>Thank you for booking with us!</p>
<p>Best regards,<br/>TRIPNEST</p>`,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}
