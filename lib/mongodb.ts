// lib/mongodb.ts
import { MongoClient } from 'mongodb';

// 1. Mandatory Environmental Parameter Guards Checks
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI parameter to your local or deployment environment.');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please add your MONGODB_DB target catalog name string variable to your environment configuration.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// 2. Establish Global Variable Caching to Prevent Pipeline Exhaustion During Dev Hot-Reloads
if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Safe isolated connection pool for high-performance live execution environments
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
