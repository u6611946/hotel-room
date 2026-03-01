import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    let query = {};
    if (guests) {
      query.capacity = { $gte: parseInt(guests) };
    }

    const rooms = await roomsCollection.find(query).toArray();

    if (checkIn && checkOut) {
      const bookingsCollection = db.collection('bookings');
      const overlappingBookings = await bookingsCollection
        .find({
          $or: [{ checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }],
          status: { $ne: 'Cancelled' }
        })
        .toArray();
      const bookedRoomIds = overlappingBookings.map(b => b.roomId);
      const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room.id));
      return NextResponse.json(availableRooms, { status: 200 });
    }

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error('GET rooms error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.capacity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    // ✅ Find the highest existing id and add 1 (avoids duplicate IDs after deletions)
    const lastRoom = await roomsCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    const roomId = lastRoom.length > 0 ? (lastRoom[0].id || 0) + 1 : 1;

    const newRoom = {
      id: roomId,
      name: body.name,
      price: body.price,
      capacity: body.capacity,
      amenities: body.amenities || [],
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      createdAt: new Date(),
    };

    const result = await roomsCollection.insertOne(newRoom);
    return NextResponse.json({ ...newRoom, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST room error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}