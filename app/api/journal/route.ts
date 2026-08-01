import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import {
  serializeJournalEntry,
  type JournalEntryDocument,
} from '@/lib/models/JournalEntry';

/**
 * GET /api/journal
 *
 * Returns the authenticated user's personal journal history, newest first.
 *
 * Acceptance Criteria:
 *   - Fetches the active session user's journal entries from MongoDB.
 *   - Rejects unauthenticated callers with 401 Unauthorized.
 *   - Returns entries ordered by visitDate (most recent first).
 */
export async function GET() {
  // 1. Auth guard — reject unauthenticated callers.
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'You must be signed in to view your journal.' },
      { status: 401 },
    );
  }

  // 2. Persist query.
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

    const entries = await db
      .collection<JournalEntryDocument>('journalEntries')
      .find({ userId: userRecord._id as ObjectId })
      .sort({ visitDate: -1 })
      .toArray();

    return NextResponse.json(entries.map(serializeJournalEntry), { status: 200 });
  } catch (error) {
    console.error('GET /api/journal error:', error);
    return NextResponse.json(
      { message: 'Failed to load your journal. Please try again.' },
      { status: 500 },
    );
  }
}
