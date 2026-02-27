import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.name || !body.price || !body.capacity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const updatedRoom = {
      name: body.name,
      price: body.price,
      capacity: body.capacity,
      amenities: body.amenities || [],
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      updatedAt: new Date(),
    };

    const result = await roomsCollection.updateOne(
      { id: parseInt(id) },
      { $set: updatedRoom }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Room updated successfully', ...updatedRoom, id: parseInt(id) },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT room error:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const result = await roomsCollection.deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Room deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE room error:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const room = await roomsCollection.findOne({ id: parseInt(id) });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error('GET room error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
