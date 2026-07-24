import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const temples = await db
      .collection('temples')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(temples);
  } catch (error) {
    console.error("Database connection route error:", error);
    return NextResponse.json(
      { error: "Failed fetching temple records from the database." }, 
      { status: 500 }
    );
  }
}
