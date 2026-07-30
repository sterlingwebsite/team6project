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
 * Shape of the validated request body coming from POST /api/journal.
 * All fields are strings from JSON; the route coerces them to the
 * correct types before persisting.
 */
export interface JournalEntryInput {
  templeId: string;
  visitDate: string; // ISO date string e.g. "2026-07-28"
  insights: string;
}

/** Minimum insight length (characters). */
export const INSIGHTS_MIN_LENGTH = 1;

/**
 * Validates a raw request body and returns a typed JournalEntryInput or
 * a non-empty FieldErrors object listing every invalid field.
 */
export function validateJournalEntryInput(body: unknown): {
  data: JournalEntryInput | null;
  errors: Partial<Record<keyof JournalEntryInput, string>>;
} {
  const errors: Partial<Record<keyof JournalEntryInput, string>> = {};

  if (typeof body !== 'object' || body === null) {
    return {
      data: null,
      errors: {
        templeId: 'Request body must be a JSON object.',
      },
    };
  }

  const raw = body as Record<string, unknown>;

  // --- templeId ---
  if (!raw.templeId || typeof raw.templeId !== 'string' || !raw.templeId.trim()) {
    errors.templeId = 'templeId is required.';
  } else if (!ObjectId.isValid(raw.templeId)) {
    errors.templeId = 'templeId must be a valid ObjectId.';
  }

  // --- visitDate ---
  const todayStr = new Date().toISOString().split('T')[0];
  if (!raw.visitDate || typeof raw.visitDate !== 'string' || !raw.visitDate.trim()) {
    errors.visitDate = 'visitDate is required.';
  } else {
    const parsed = new Date(raw.visitDate);
    if (isNaN(parsed.getTime())) {
      errors.visitDate = 'visitDate must be a valid date.';
    } else if (raw.visitDate > todayStr) {
      errors.visitDate = 'visitDate cannot be in the future.';
    }
  }

  // --- insights ---
  if (
    !raw.insights ||
    typeof raw.insights !== 'string' ||
    raw.insights.trim().length < INSIGHTS_MIN_LENGTH
  ) {
    errors.insights = 'insights is required.';
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      templeId: (raw.templeId as string).trim(),
      visitDate: (raw.visitDate as string).trim(),
      insights: (raw.insights as string).trim(),
    },
    errors: {},
  };
}
