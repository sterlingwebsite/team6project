import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const userEmail = 'sterling@example.com'; 
    const user = await db.collection('users').findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    const userFacts = await db.collection('templeFacts')
      .find({ creatorId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    const populatedFacts = await Promise.all(
      userFacts.map(async (fact) => {
        let templeName = 'Unknown Temple';
        try {
          const temple = await db.collection('temples').findOne({ slug: fact.templeSlug });
          if (temple?.name) templeName = temple.name;
        } catch {
        }
        return {
          ...fact,
          templeName
        };
      })
    );

    return NextResponse.json(populatedFacts, { status: 200 });
  } catch (error) {
    console.error('GET User Facts Error:', error);
    return NextResponse.json({ message: 'Internal server lookup error.' }, { status: 500 });
  }
}
