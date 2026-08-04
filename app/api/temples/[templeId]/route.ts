// app/api/temples/[templeId]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

interface ITempleImageConfig {
  full?: string;
  thumb?: string;
  caption?: string;
}

interface ITempleDocument {
  _id?: string | ObjectId;
  name: string;
  slug: string;
  status?: string;
  image?: ITempleImageConfig;
  imageUrl?: string;
}

interface IRemoteTemplePayload {
  slug: string;
  id: string | number;
  name: string;
  status?: string;
  image?: ITempleImageConfig;
  imageUrl?: string;
  [key: string]: unknown;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ templeId: string }> }
) {
  const { templeId } = await params;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const queryConditions: Record<string, unknown>[] = [
      { slug: templeId },
      { id: templeId },
      { name: { $regex: new RegExp(`^${templeId.replace(/-/g, ' ')}$`, 'i') } }
    ];

    if (ObjectId.isValid(templeId)) {
      queryConditions.push({ _id: new ObjectId(templeId) });
    }

    const localRecord = await db.collection('temples').findOne({
      $or: queryConditions
    });

    let temple: ITempleDocument | null = null;

    if (localRecord) {
      temple = {
        _id: localRecord._id,
        name: localRecord.name,
        slug: localRecord.slug,
        status: localRecord.status,
        image: localRecord.image,
        imageUrl: localRecord.imageUrl
      };
    } else {
      console.warn(`[API Notice] Temple "${templeId}" not found in local collections. Attempting live remote proxy fallback...`);
      temple = { 
        name: templeId.replace(/-/g, ' '), 
        slug: templeId 
      };
    }

    try {
      const cleanSearchTerm = templeId.replace(/-/g, ' ');
      const remoteRes = await fetch(
        `https://www.templedb.org/api/temples?search=${encodeURIComponent(cleanSearchTerm)}`
      );

      if (remoteRes.ok && temple) {
        const remoteData = await remoteRes.json();
        const list: IRemoteTemplePayload[] = remoteData.temples || remoteData.data || [];

        const remoteMatched =
          list.find((t: IRemoteTemplePayload) => t.slug === templeId || t.id?.toString() === templeId || t.name?.toLowerCase() === cleanSearchTerm.toLowerCase()) ||
          list[0];

        if (remoteMatched) {
          temple.name = temple.name || remoteMatched.name;
          temple.status = temple.status || remoteMatched.status || "Dedicated";
          
          if (remoteMatched.image) {
            temple.image = remoteMatched.image;
          }

          if (remoteMatched.imageUrl) {
            try {
              const decoded = decodeURIComponent(remoteMatched.imageUrl);
              temple.imageUrl = decoded.startsWith('http') ? decoded : `https://templedb.org${decoded.startsWith('/') ? '' : '/'}${decoded}`;
            } catch {
              temple.imageUrl = remoteMatched.imageUrl;
            }
          }
        }
      }
    } catch (fetchError) {
      console.error("[API Warning] Remote TempleDB fetch failed:", fetchError);
    }

    if (!temple || !temple.name || (!temple.image && !temple.imageUrl)) {
      return NextResponse.json(
        { error: `Temple profile matching "${templeId}" could not be resolved from local or remote assets.` },
        { status: 404 }
      );
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error("Dynamic route execution processing error:", error);
    return NextResponse.json({ error: 'Internal server lookup exception' }, { status: 500 });
  }
}
