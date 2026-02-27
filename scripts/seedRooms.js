import { getDatabase } from '../lib/mongodb.js';

const rooms = [
  {
    id: 1,
    name: 'Standard Room',
    price: 120,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    description: 'Cozy room perfect for single travelers or couples',
    imageUrl: '/images/standard-room.jpg',
  },
  {
    id: 2,
    name: 'Deluxe Room',
    price: 200,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'],
    description: 'Spacious room with premium amenities for a comfortable stay',
    imageUrl: '/images/deluxe-room.jpg',
  },
  {
    id: 3,
    name: 'Suite',
    price: 350,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Hot Tub', 'Living Area'],
    description: 'Luxury suite with separate living area and premium facilities',
    imageUrl: '/images/suite-room.jpg',
  },
  {
    id: 4,
    name: 'Family Room',
    price: 280,
    capacity: 5,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge', 'Extra Beds'],
    description: 'Spacious room designed for families with multiple beds',
    imageUrl: '/images/family-room.jpg',
  },
  {
    id: 5,
    name: 'Executive Suite',
    price: 450,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Work Desk', 'Balcony'],
    description: 'Premium executive suite with work area and stunning views',
    imageUrl: '/images/executive-suite.jpg',
  },
];

async function seedRooms() {
  try {
    const db = await getDatabase();
    const roomsCollection = db.collection('rooms');

    // Check if rooms already exist
    const existingRooms = await roomsCollection.countDocuments();
    
    if (existingRooms > 0) {
      console.log(`Found ${existingRooms} existing rooms. Clearing collection...`);
      await roomsCollection.deleteMany({});
    }

    // Insert rooms
    const result = await roomsCollection.insertMany(
      rooms.map(room => ({
        ...room,
        createdAt: new Date(),
      }))
    );

    console.log(`✅ Successfully seeded ${result.insertedCount} rooms!`);
    console.log('Room IDs:', result.insertedIds);
    
    // Display the rooms
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
