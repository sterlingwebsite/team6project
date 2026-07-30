import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import {
  validateJournalEntryInput,
  type JournalEntryDocument,
} from '@/lib/models/JournalEntry';

/**
 * POST /api/journal
 *
 * Creates a new temple journal entry for the authenticated session user.
 *
 * Acceptance Criteria:
 *   - Extracts data fields and saves the document to MongoDB.
 *   - Returns 400 Bad Request when mandatory fields are blank or the
 *     templeId is not a valid ObjectId.
 *   - Automatically links the entry to the correct userId extracted
 *     from the secure session token.
 *   - Returns the newly created entry document as JSON with 201 Created.
 */
export async function POST(request: Request) {
  // 1. Auth guard — reject unauthenticated callers.
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'You must be signed in to create a journal entry.' },
      { status: 401 },
    );
  }

  // 2. Parse request body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON in request body.' },
      { status: 400 },
    );
  }

  // 3. Validate payload fields.
  const { data, errors } = validateJournalEntryInput(body);

  if (!data) {
    return NextResponse.json(
      { message: 'Missing or invalid fields.', errors },
      { status: 400 },
    );
  }

  // 4. Persist to MongoDB.
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Resolve userId from the authenticated session.
    const usersCollection = db.collection('users');
    const userRecord = await usersCollection.findOne({ email: session.user.email });

    if (!userRecord) {
      return NextResponse.json(
        { message: 'Authenticated user record not found.' },
        { status: 404 },
      );
    }

    const entry: JournalEntryDocument = {
      userId: userRecord._id as ObjectId,
      templeId: new ObjectId(data.templeId),
      visitDate: new Date(data.visitDate),
      insights: data.insights,
      createdAt: new Date(),
    };

    const result = await db.collection('journalEntries').insertOne(entry);

    return NextResponse.json(
      { ...entry, _id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/journal error:', error);
    return NextResponse.json(
      { message: 'Failed to save your journal entry. Please try again.' },
      { status: 500 },
    );
  }
}
