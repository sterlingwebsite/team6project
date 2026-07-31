// app/api/temples/[templeId]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ templeId: string }> }
) {
  const { templeId } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    // 1. Log incoming parameter context to check what Next.js sees
    console.log(`[API] Fetching temple record for slug token: "${templeId}"`);

    // 2. Query checking standard schema patterns
    let temple = await db.collection('temples').findOne({
      $or: [
        { slug: templeId },
        { id: templeId },
        { name: { $regex: new RegExp(`^${templeId.replace(/-/g, ' ')}$`, 'i') } } // Fallback name check
      ]
    });

    // 3. Fallback: If no match, inspect one document from the collection to debug the schema structures
    if (!temple) {
      console.warn(`[API] Exact match fail for "${templeId}". Inspecting collection keys...`);
      const sampleDoc = await db.collection('temples').findOne({});
      console.log("[API] Sample database document structure keys:", sampleDoc ? Object.keys(sampleDoc) : "Collection is completely empty!");
    }

    if (!temple) {
      return NextResponse.json(
        { error: `Temple profile matching "${templeId}" not found in database.` }, 
        { status: 404 }
      );
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error("Dynamic route execution processing error:", error);
    return NextResponse.json({ error: 'Internal server lookup exception' }, { status: 500 });
  }
}
