import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import {
  serializeJournalEntry,
  type JournalEntryDocument,
} from '@/lib/models/JournalEntry';

/**
 * GET /api/journal/[id]
 *
 * Returns a single journal entry owned by the authenticated user.
 *
 * Acceptance Criteria:
 *   - Rejects unauthenticated callers with 401 Unauthorized.
 *   - Returns 400 Bad Request when [id] is not a valid ObjectId.
 *   - Returns 404 Not Found when no entry exists for [id].
 *   - Returns 403 Forbidden when the entry belongs to another user.
 *   - Returns the serialized entry document as JSON on success.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<'/api/journal/[id]'>,
) {
  const { id } = await params;

  // 1. Auth guard — reject unauthenticated callers.
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'You must be signed in to view a journal entry.' },
      { status: 401 },
    );
  }

  // 2. Validate the route id is a well-formed ObjectId.
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: 'Invalid journal entry id.' },
      { status: 400 },
    );
  }

  // 3. Persist query.
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Resolve userId from the authenticated session.
    const usersCollection = db.collection('users');
    const userRecord = await usersCollection.findOne({ email: session.user.email });

    if (!userRecord) {
      return NextResponse.json(
        { message: 'Authenticated user record not found.' },
        { status: 401 },
      );
    }

    const entry = await db
      .collection<JournalEntryDocument>('journalEntries')
      .findOne({ _id: new ObjectId(id) });

    if (!entry) {
      return NextResponse.json(
        { message: 'Journal entry not found.' },
        { status: 404 },
      );
    }

    // 4. Ownership validation — shield cross-user data access.
    if (!entry.userId.equals(userRecord._id as ObjectId)) {
      return NextResponse.json(
        { message: 'You are not allowed to view this journal entry.' },
        { status: 403 },
      );
    }

    return NextResponse.json(serializeJournalEntry(entry), { status: 200 });
  } catch (error) {
    console.error('GET /api/journal/[id] error:', error);
    return NextResponse.json(
      { message: 'Failed to load the journal entry. Please try again.' },
      { status: 500 },
    );
  }
}
