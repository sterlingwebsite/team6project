import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import {
  validateJournalEntryInput,
  type JournalEntryDocument,
} from '@/lib/models/JournalEntry';

async function getSessionUser() {
  const session = await auth();
  return session?.user || null;
}

export async function GET() {
  const user = await getSessionUser();

  if (!user || !user.email) {
    return NextResponse.json(
      { message: 'You must be signed in to view your journal entries.' },
      { status: 401 },
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const usersCollection = db.collection('users');
    let userRecord = await usersCollection.findOne({ email: user.email });

    if (!userRecord) {
      const insertionResult = await usersCollection.insertOne({
        email: user.email,
        name: user.name || 'User',
        createdAt: new Date()
      });
      userRecord = { _id: insertionResult.insertedId, email: user.email };
    }

    const entries = await db
      .collection('journalEntries')
      .find({ userId: userRecord._id })
      .sort({ visitDate: -1 })
      .toArray();

    const populatedEntries = await Promise.all(
      entries.map(async (entry) => {
        let templeName = 'Unknown Temple';
        try {
          const temple = await db.collection('temples').findOne({ _id: new ObjectId(entry.templeId) });
          if (temple?.name) {
            templeName = temple.name;
          } else {
            templeName = entry.templeName || 'Salt Lake Temple';
          }
        } catch {
          templeName = entry.templeName || 'Salt Lake Temple';
        }
        return {
          ...entry,
          templeName,
        };
      })
    );

    return NextResponse.json(populatedEntries, { status: 200 });
  } catch (error) {
    console.error('GET /api/journal error:', error);
    return NextResponse.json(
      { message: 'Failed to extract your journal collections.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user || !user.email) {
    return NextResponse.json(
      { message: 'You must be signed in to create journal entries.' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    
    const { data, errors } = validateJournalEntryInput(body);
    if (!data || Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const userRecord = await db.collection('users').findOne({ email: user.email });
    if (!userRecord) {
      return NextResponse.json({ message: 'User profile mismatch.' }, { status: 404 });
    }

    const newEntry: JournalEntryDocument = {
      userId: userRecord._id,
      templeId: new ObjectId(data.templeId),
      visitDate: new Date(data.visitDate),
      insights: data.insights,
      createdAt: new Date(),
    };

    const result = await db.collection('journalEntries').insertOne(newEntry);

    return NextResponse.json(
      { message: 'Journal entry created successfully.', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/journal error:', error);
    return NextResponse.json(
      { message: 'Failed to create journal entry.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await auth();
  if (!user?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');

    if (!entryId || !ObjectId.isValid(entryId)) {
      return NextResponse.json({ message: 'Valid entry ID parameters are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const userRecord = await db.collection('users').findOne({ email: user.user.email });
    if (!userRecord) {
      return NextResponse.json({ message: 'User mapping failure.' }, { status: 404 });
    }

    const targetId = new ObjectId(entryId);
    const deletionResult = await db.collection('journalEntries').deleteOne({
      _id: targetId,
      userId: userRecord._id
    });

    if (deletionResult.deletedCount === 0) {
      return NextResponse.json({ message: 'Journal entry not found or unauthorized.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Journal record dropped successfully.' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/journal failure:', error);
    return NextResponse.json({ message: 'Internal server collection delete crash.' }, { status: 500 });
  }
}
