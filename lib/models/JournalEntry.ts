import { ObjectId } from 'mongodb';

/**
 * JournalEntry data model — mirrors the spec entity:
 *   _id       ObjectId  (Primary Key, auto-generated)
 *   userId    ObjectId  (FK → User._id, set from session)
 *   templeId  ObjectId  (FK → Temple._id, required)
 *   visitDate Date      (required)
 *   insights  string    (required, min 1 char)
 *   createdAt Date      (auto-generated timestamp)
 */
export interface JournalEntryDocument {
  _id?: ObjectId;
  userId: ObjectId;
  templeId: ObjectId;
  visitDate: Date;
  insights: string;
  createdAt: Date;
}

/**
 * JSON-safe representation of a journal entry returned by the API.
 * ObjectIds are converted to hex strings and Dates to ISO strings so the
 * document can be serialized cleanly by Response.json().
 */
export interface SerializedJournalEntry {
  _id: string;
  userId: string;
  templeId: string;
  visitDate: string;
  insights: string;
  createdAt: string;
}

/**
 * Converts a raw MongoDB journal entry document into a JSON-safe payload.
 */
export function serializeJournalEntry(
  entry: JournalEntryDocument,
): SerializedJournalEntry {
  return {
    _id: entry._id?.toHexString() ?? '',
    userId: entry.userId.toHexString(),
    templeId: entry.templeId.toHexString(),
    visitDate: entry.visitDate.toISOString(),
    insights: entry.insights,
    createdAt: entry.createdAt.toISOString(),
  };
}
