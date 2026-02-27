import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    const db = await getDatabase();
    
    // If email is provided, filter by email, otherwise return all bookings
    const query = email ? { email } : {};
    const bookings = await db.collection('bookings').find(query).toArray();
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    // Get the count to generate booking ID
    const count = await bookingsCollection.countDocuments();
    const bookingId = `BKG-${String(count + 1).padStart(3, '0')}`;

    const newBooking = {
      id: bookingId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      roomName: body.roomName,
      roomId: body.roomId,
      guests: body.guests,
      nights: body.nights,
      totalPrice: body.totalPrice,
      status: 'Confirmed',
      bookingDate: body.bookingDate,
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(newBooking);
    
    return NextResponse.json(
      { ...newBooking, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}