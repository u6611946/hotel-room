import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const objectId = toObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 });
    }

    const room = await roomsCollection.findOne({ _id: objectId });
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ ...room, _id: room._id.toString() }, { status: 200 });
  } catch (error) {
    console.error('GET room error:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || !body.price || !body.capacity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const objectId = toObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 });
    }

    const updatedRoom = {
      name: body.name,
      price: Number(body.price),
      capacity: Number(body.capacity),
      amenities: body.amenities || [],
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      updatedAt: new Date(),
    };

    const result = await roomsCollection.updateOne(
      { _id: objectId },
      { $set: updatedRoom }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Room updated successfully', ...updatedRoom, _id: id },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT room error:', error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const objectId = toObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 });
    }

    const result = await roomsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Room deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE room error:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}