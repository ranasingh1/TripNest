import { NextRequest, NextResponse } from 'next/server';
import Property from '@/lib/models/Property';
import { verifyFirebaseToken } from '@/lib/auth/verifyFirebaseToken';
import { dbConnect } from '@/lib/db';

async function getProperty(id: string) {
  await dbConnect();
  return Property.findById(id);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (property.owner !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Merge updated data and save the property
    Object.assign(property, data);
    await property.save();

    return NextResponse.json(property);
  } catch (error) {
    console.error('PUT /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyFirebaseToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (property.owner !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await property.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
