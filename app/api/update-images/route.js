import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

const imageUpdates = {
  1: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  2: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  3: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  4: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
  5: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
};

export async function POST() {
  try {
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    const updates = [];
    for (const [id, imageUrl] of Object.entries(imageUpdates)) {
      const result = await roomsCollection.updateOne(
        { id: parseInt(id) },
        { $set: { imageUrl, updatedAt: new Date() } }
      );
      updates.push({ id, matched: result.matchedCount, modified: result.modifiedCount });
    }

    return NextResponse.json(
      { 
        message: 'Room images updated!',
        updates
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update rooms images error:', error);
    return NextResponse.json(
      { error: 'Failed to update room images' },
      { status: 500 }
    );
  }
}
