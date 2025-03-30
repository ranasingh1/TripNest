import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Booking from '@/lib/models/Bookings';
import Property from '@/lib/models/Property';
import { verifyFirebaseToken } from '@/lib/auth/verifyFirebaseToken';
import { dbConnect } from '@/lib/db';


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,           
  port: Number(process.env.EMAIL_PORT),     
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

async function getBooking(id: string) {
  await dbConnect();
  return Booking.findById(id);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await dbConnect();
    // Populate property details for the booking
    const booking = await Booking.findById(id).populate('propertyId');
    if (!booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    console.error('GET /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    await dbConnect();

    const booking = await Booking.findById(id);
    if (!booking)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Store the old status before updating
    const oldStatus = booking.status;

    // If cancelling the booking, update the property inventory
    if (data.status === 'cancelled' && booking.status !== 'cancelled') {
      const property = await Property.findById(booking.propertyId);
      if (property) {
        const bookingDates: string[] = [];
        for (
          let d = new Date(booking.checkIn);
          d < new Date(booking.checkOut);
          d.setDate(d.getDate() + 1)
        ) {
          bookingDates.push(d.toISOString().slice(0, 10));
        }
        property.inventory = property.inventory.filter((d: Date) => {
          const dStr = new Date(d).toISOString().slice(0, 10);
          return !bookingDates.includes(dStr);
        });
        property.bookings = Math.max((property.bookings || 1) - 1, 0);
        await property.save();
      }
    }

    Object.assign(booking, data);
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id).populate('propertyId');

    if (updatedBooking?.status === 'confirmed' && oldStatus !== 'confirmed') {
      const property = updatedBooking.propertyId;
      try {
        await transporter.sendMail({
          from: '"TRIPNEST" <no-reply@tripnest.com>',
          to: updatedBooking.email,
          subject: 'Booking Confirmation',
          text: `Hi ${updatedBooking.name},

Your booking for "${property.title}" from ${new Date(updatedBooking.checkIn).toLocaleDateString()} to ${new Date(updatedBooking.checkOut).toLocaleDateString()} has been confirmed.

Thank you for booking with us!

Best regards,
TRIPNEST`,
          html: `<p>Hi ${updatedBooking.name},</p>
<p>Your booking for <strong>${property.title}</strong> from <strong>${new Date(updatedBooking.checkIn).toLocaleDateString()}</strong> to <strong>${new Date(updatedBooking.checkOut).toLocaleDateString()}</strong> has been confirmed.</p>
<p>Thank you for booking with us!</p>
<p>Best regards,<br/>TRIPNEST</p>`,
        });
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        // Optionally handle the error further
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('PUT /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const booking = await Booking.findById(id);
    if (!booking)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // If the booking is not already cancelled, update the property inventory
    if (booking.status !== 'cancelled') {
      const property = await Property.findById(booking.propertyId);
      if (property) {
        const bookingDates: string[] = [];
        for (
          let d = new Date(booking.checkIn);
          d < new Date(booking.checkOut);
          d.setDate(d.getDate() + 1)
        ) {
          bookingDates.push(d.toISOString().slice(0, 10));
        }
        property.inventory = property.inventory.filter((d: Date) => {
          const dStr = new Date(d).toISOString().slice(0, 10);
          return !bookingDates.includes(dStr);
        });
        property.bookings = Math.max((property.bookings || 1) - 1, 0);
        await property.save();
      }
    }

    await booking.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
