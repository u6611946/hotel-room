import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const updateData = {};
    if (body.status) updateData.status = body.status;
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;

    updateData.updatedAt = new Date();

    const result = await bookingsCollection.updateOne(
      { id: id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const result = await bookingsCollection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const booking = await bookingsCollection.findOne({ id: id });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
