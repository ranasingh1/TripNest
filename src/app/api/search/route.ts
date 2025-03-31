import { NextRequest, NextResponse } from 'next/server';
import Property from '@/lib/models/Property';
import { dbConnect } from '@/lib/db';

//API route to search properties
export async function GET(req: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const query: any = {};

  if (destination) {
    query.location = { $regex: destination, $options: 'i' };
  }

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json(
        { error: 'Invalid check-in or check-out dates' },
        { status: 400 }
      );
    }
    
    const searchDates: Date[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      searchDates.push(new Date(d));
    }
    
    query.inventory = { $not: { $elemMatch: { $in: searchDates } } };
  }

  try {
    const properties = await Property.find(query).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
