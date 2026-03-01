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

    // Try ObjectId first, fall back to string id
    const objectId = toObjectId(id);
    const query = objectId ? { _id: objectId } : { id: id };

    const result = await bookingsCollection.updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PATCH booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const objectId = toObjectId(id);
    const query = objectId ? { _id: objectId } : { id: id };

    const result = await bookingsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE booking error:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    const objectId = toObjectId(id);
    const query = objectId ? { _id: objectId } : { id: id };

    const booking = await bookingsCollection.findOne(query);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}