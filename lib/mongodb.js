import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'web-hotelBooking';

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db(dbName);
}