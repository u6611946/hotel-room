import { getDatabase } from '../lib/mongodb.js';

const rooms = [
  {
    id: 1,
    name: 'Standard Room',
    price: 120,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    description: 'Cozy room perfect for single travelers or couples',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Deluxe Room',
    price: 200,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'],
    description: 'Spacious room with premium amenities for a comfortable stay',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Suite',
    price: 350,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Hot Tub', 'Living Area'],
    description: 'Luxury suite with separate living area and premium facilities',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Family Room',
    price: 280,
    capacity: 5,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge', 'Extra Beds'],
    description: 'Spacious room designed for families with multiple beds',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Executive Suite',
    price: 450,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Work Desk', 'Balcony'],
    description: 'Premium executive suite with work area and stunning views',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Superior',
    price: 199,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge'],
    description: 'Suitable for small family',
    imageUrl: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop',
  },
];

async function seedRooms() {
  try {
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');
    const existingRooms = await roomsCollection.countDocuments();
    if (existingRooms > 0) {
      console.log(`Found ${existingRooms} existing rooms. Clearing collection...`);
      await roomsCollection.deleteMany({});
    }
    const result = await roomsCollection.insertMany(
      rooms.map(room => ({ ...room, createdAt: new Date() }))
    );
    console.log(`✅ Successfully seeded ${result.insertedCount} rooms!`);
    const allRooms = await roomsCollection.find({}).toArray();
    console.log('\nSeeded Rooms:');
    allRooms.forEach(room => {
      console.log(`- ${room.name}: $${room.price}/night, Capacity: ${room.capacity}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    process.exit(1);
  }
}

seedRooms();