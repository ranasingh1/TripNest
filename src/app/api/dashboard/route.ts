import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Property from "@/lib/models/Property";
import Bookings from "@/lib/models/Bookings";
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

    const [properties, bookings] = await Promise.all([
      Property.find({ ownerEmail: decoded.email, status: "Active" }),
      Bookings.find({ email: decoded.email, status: { $in: ["confirmed", "pending"] } }),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const totalNights = bookings.reduce((sum, b) => {
      const nights = Math.ceil(
        (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      );
      return sum + nights;
    }, 0);

    const occupancyRate =
      properties.length > 0
        ? Math.min(100, Math.round((totalNights / (properties.length * 30)) * 100))
        : 0;

    return NextResponse.json({
      properties: properties.length,
      bookings: bookings.length,
      revenue: totalRevenue,
      occupancyRate,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
