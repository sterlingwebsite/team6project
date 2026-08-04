// app/api/user/facts/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'You must be signed in to view your facts data.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const fetchLikedOnly = searchParams.get('liked') === 'true';

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    if (fetchLikedOnly) {
      const likedRecordsCount = await db.collection('factLikes')
        .countDocuments({ userId: user._id });
        
      return NextResponse.json({ total: likedRecordsCount }, { status: 200 });
    }

    const userFacts = await db.collection('templeFacts')
      .find({ creatorId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    const populatedFacts = await Promise.all(
      userFacts.map(async (fact) => {
        let templeName = 'Unknown Temple';
        let templeIdString = '';
        
        try {
          let query: Record<string, unknown> = {};
          
          if (fact.templeSlug) {
            query = { slug: fact.templeSlug };
          } else if (fact.templeId && ObjectId.isValid(fact.templeId.toString())) {
            query = { _id: new ObjectId(fact.templeId.toString()) };
          } else {
            query = { slug: fact.templeId };
          }
            
          const temple = await db.collection('temples').findOne(query);
          if (temple) {
            templeName = temple.name || 'Unknown Temple';
            templeIdString = temple._id.toString();
          }
        } catch (joinError) {
          console.error("Temple join operation failure:", joinError);
        }
        
        return {
          ...fact,
          templeId: fact.templeId ? fact.templeId.toString() : templeIdString,
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
