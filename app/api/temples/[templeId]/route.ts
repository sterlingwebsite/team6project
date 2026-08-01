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
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const temple = await db.collection('temples').findOne({
      $or: [
        { slug: templeId },
        { id: templeId },
        { name: { $regex: new RegExp(`^${templeId.replace(/-/g, ' ')}$`, 'i') } }
      ]
    });

    if (!temple) {
      return NextResponse.json(
        { error: `Temple profile matching "${templeId}" not found in database.` },
        { status: 404 }
      );
    }

    if (temple.imageUrl) {
      try {
        const decoded = decodeURIComponent(temple.imageUrl);
        temple.imageUrl = decoded.replace(/^https:\/\/templedb\.org\//, "");
      } catch {
      }
    }

    try {
      const cleanSearchTerm = templeId.replace(/-/g, ' ');
      const remoteRes = await fetch(
        `https://templedb.org/api/temples?search=${encodeURIComponent(cleanSearchTerm)}`
      );

      if (remoteRes.ok) {
        const remoteData = await remoteRes.json();
        const list = remoteData.temples || remoteData.data || [];

        const remoteMatched =
          list.find((t: any) => t.slug === templeId || t.id?.toString() === templeId) ||
          list[0];

        if (remoteMatched) {
          if (remoteMatched.image) {
            temple.image = remoteMatched.image;
          }

          if (remoteMatched.imageUrl) {
            try {
              const decoded = decodeURIComponent(remoteMatched.imageUrl);
              temple.imageUrl = decoded.replace(/^https:\/\/templedb\.org\//, "");
            } catch {
              temple.imageUrl = remoteMatched.imageUrl;
            }
          }
        }
      }
    } catch (fetchError) {
      console.error("[API Warning] Remote TempleDB fetch failed:", fetchError);
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error("Dynamic route execution processing error:", error);
    return NextResponse.json({ error: 'Internal server lookup exception' }, { status: 500 });
  }
}
