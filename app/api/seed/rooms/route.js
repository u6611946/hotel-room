import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

const rooms = [
  {
    id: 1,
    name: 'Standard Room',
    price: 120,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    description: 'Cozy room perfect for single travelers or couples',
    imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  },
  {
    id: 2,
    name: 'Deluxe Room',
    price: 200,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'],
    description: 'Spacious room with premium amenities for a comfortable stay',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  },
  {
    id: 3,
    name: 'Suite',
    price: 350,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Hot Tub', 'Living Area'],
    description: 'Luxury suite with separate living area and premium facilities',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  },
  {
    id: 4,
    name: 'Family Room',
    price: 280,
    capacity: 5,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge', 'Extra Beds'],
    description: 'Spacious room designed for families with multiple beds',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
  },
  {
    id: 5,
    name: 'Executive Suite',
    price: 450,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Work Desk', 'Balcony'],
    description: 'Premium executive suite with work area and stunning views',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  },
];

export async function POST() {
  try {
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    // Check if rooms already exist
    const existingRooms = await roomsCollection.countDocuments();
    
    if (existingRooms > 0) {
      return NextResponse.json(
        { 
          message: `${existingRooms} rooms already exist in the database`,
          note: 'Delete existing rooms first if you want to reseed'
        },
        { status: 200 }
      );
    }

    // Insert rooms
    const result = await roomsCollection.insertMany(
      rooms.map(room => ({
        ...room,
        createdAt: new Date(),
      }))
    );

    return NextResponse.json(
      { 
        message: `Successfully seeded ${result.insertedCount} rooms!`,
        rooms: rooms.map(r => ({ id: r.id, name: r.name, price: r.price }))
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed rooms error:', error);
    return NextResponse.json(
      { error: 'Failed to seed rooms' },
      { status: 500 }
    );
  }
}
