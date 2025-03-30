import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Property from "@/lib/models/Property";
import Booking from "@/lib/models/Bookings";
import { verifyFirebaseToken } from "@/lib/auth/verifyFirebaseToken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyFirebaseToken(token);

    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();

    const properties = await Property.find(
      { ownerEmail: decoded.email },
      "_id title inventory location"
    ).lean();

    const bookings = await Booking.find(
      { email: decoded.email },
      "propertyId propertyName name checkIn checkOut status"
    ).lean();

    return NextResponse.json({
      properties: properties.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        location: p.location,
        blockedDates: p.inventory,
      })),
      bookings: bookings.map((b: any) => ({
        id: b._id.toString(),
        propertyId: b.propertyId.toString(),
        propertyName: b.propertyName,
        guestName: b.name,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
      })),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
