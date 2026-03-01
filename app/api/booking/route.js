import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    let query = {};
    if (email) {
      query.email = email;
    }

    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = bookings.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }));

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error('GET bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (
      !body.roomId ||
      !body.roomName ||
      !body.checkIn ||
      !body.checkOut ||
      !body.guests ||
      !body.firstName ||
      !body.lastName ||
      !body.email
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const checkInDate = new Date(body.checkIn);
    const checkOutDate = new Date(body.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    const newBooking = {
      roomId: body.roomId,
      roomName: body.roomName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: Number(body.guests),
      nights: nights,
      pricePerNight: Number(body.pricePerNight) || 0,
      totalPrice: Number(body.totalPrice) || 0,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || '',
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(newBooking);

    return NextResponse.json(
      { ...newBooking, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}