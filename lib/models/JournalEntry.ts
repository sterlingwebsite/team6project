import { ObjectId } from 'mongodb';

export interface JournalEntryDocument {
  _id?: ObjectId;
  userId: ObjectId;
  templeId: ObjectId;
  visitDate: Date;
  insights: string;
  createdAt: Date;
}

export interface JournalEntryInput {
  templeId: string;
  visitDate: string;
  insights: string;
}

export const INSIGHTS_MIN_LENGTH = 1;

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

  if (!raw.templeId || typeof raw.templeId !== 'string' || !raw.templeId.trim()) {
    errors.templeId = 'templeId is required.';
  } else if (!ObjectId.isValid(raw.templeId)) {
    errors.templeId = 'templeId must be a valid ObjectId.';
  }

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
