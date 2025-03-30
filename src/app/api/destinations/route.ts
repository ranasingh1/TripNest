import { dbConnect } from "@/lib/db";
import Property from "@/lib/models/Property";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const popularDestinations = await Property.aggregate([
      {
        $group: {
          _id: "$location_details.address", 
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ["$images", 0] } } 
        }
      },
      { $sort: { count: -1 } },
      { $limit: 4 } 
    ]);

    const destinations = popularDestinations.map((dest) => ({
      name: dest._id,
      properties: dest.count,
      image: dest.image || "/default-destination.jpg" 
    }));

    // console.log(destinations);
    return NextResponse.json(destinations);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
