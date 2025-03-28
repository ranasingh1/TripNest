import { NextRequest, NextResponse } from 'next/server';
import Property from '@/lib/models/Property';
import { verifyFirebaseToken } from '@/lib/auth/verifyFirebaseToken';
import { dbConnect } from '@/lib/db';

export async function GET() {
  await dbConnect();
  const properties = await Property.find().sort({ createdAt: -1 });
  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  // Get and verify the Firebase token
  const token = req.headers.get('authorization')?.split(' ')[1];
  const user = token ? await verifyFirebaseToken(token) : null;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  await dbConnect();

  // Build the property data explicitly so that owner fields are not overridden by client data
  const propertyData = {
    title: data.title,
    description: data.description,
    location: data.location,
    price: data.price,
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    images: data.images || [],
    beds: data.beds || 0,
    baths: data.baths || 0,
    guests: data.guests || 0,
    amenities: data.amenities || [],
    isSuperhost: data.isSuperhost || false,
    isNewListing: data.isNewListing || true,
    discount: data.discount || 0,
    availability: data.availability || '',
    host: data.host || {},
    rules: data.rules || {},
    location_details: data.location_details || {},
    // Set owner fields explicitly from the verified user
    owner: user.uid,
    ownerEmail: user.email,
  };

  console.log('Saving property with data:', propertyData);

  const newProperty = await Property.create(propertyData);

  return NextResponse.json(newProperty, { status: 201 });
}
