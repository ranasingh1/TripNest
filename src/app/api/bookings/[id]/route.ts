import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/lib/models/Bookings';
import Property from '@/lib/models/Property';
import { verifyFirebaseToken } from '@/lib/auth/verifyFirebaseToken';
import { dbConnect } from '@/lib/db';
import nodemailer from 'nodemailer';

// Email transporter
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

//API route to get a booking by ID

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const booking = await Booking.findById(id).populate('propertyId');
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('GET /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//API route to update a booking by ID
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const oldStatus = booking.status;

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
          return !bookingDates.includes(new Date(d).toISOString().slice(0, 10));
        });
        property.bookings = Math.max((property.bookings || 1) - 1, 0);
        await property.save();
      }
    }

    Object.assign(booking, data);
    await booking.save();
    const updatedBooking = await Booking.findById(booking._id).populate('propertyId');

    if (updatedBooking?.status === 'confirmed' && oldStatus !== 'confirmed') {
      try {
        await transporter.sendMail({
          from: '"TRIPNEST" <no-reply@tripnest.com>',
          to: updatedBooking.email,
          subject: 'Booking Confirmation',
          text: `Hi ${updatedBooking.name},\n\nYour booking for "${updatedBooking.propertyId.title}" has been confirmed.\n\nBest regards,\nTRIPNEST`,
          html: `<p>Hi ${updatedBooking.name},</p><p>Your booking for <strong>${updatedBooking.propertyId.title}</strong> has been confirmed.</p><p>Best regards,<br/>TRIPNEST</p>`
        });
      } catch (error) {
        console.error("Error sending confirmation email:", error);
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('PUT /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//API route to delete a booking by ID

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

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
          return !bookingDates.includes(new Date(d).toISOString().slice(0, 10));
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