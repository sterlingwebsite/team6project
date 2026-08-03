// app/api/user/facts/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth'; // Safe central session lookup checker wrapper

export async function GET() {
  // 1. Enforce active authentication token checking loops dynamically
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'You must be signed in to view your contributed facts.' },
      { status: 401 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // 2. Fetch the logged-in profile record from your database
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    // 3. Aggregate fact records created by this distinct user account object identifier
    const userFacts = await db.collection('templeFacts')
      .find({ creatorId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    // 4. Perform dynamic data mapping to guarantee both templeId and templeName populate cleanly
    const populatedFacts = await Promise.all(
      userFacts.map(async (fact) => {
        let templeName = 'Unknown Temple';
        let templeIdString = '';
        
        try {
          // Robust collection lookups handling fallback configurations seamlessly
          const query = fact.templeId 
            ? { _id: new ObjectId(fact.templeId) } 
            : { slug: fact.templeSlug };
            
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
          // Expose explicit string variables matching properties expected by frontend components
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
