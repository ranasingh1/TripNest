// app/api/popular-properties/route.ts
import { dbConnect } from "@/lib/db";
import Property from "@/lib/models/Property";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const popularProperties = await Property.find({})
      .sort({ bookings: -1 })
      .limit(4)
      .lean();

    const properties = popularProperties.map((property) => ({
      _id: property._id,
      title: property.title,
      bookings: property.bookings,
      image: property.images && property.images.length > 0 ? property.images[0] : "/default-property.jpg"
    }));

    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
