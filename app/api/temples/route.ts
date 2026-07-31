import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateTempleSlug } from "@/utils/templeHelpers"; // 1. Add this import

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";

    let url = `https://www.templedb.org/api/temples?page=${page}&per_page=20`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`TempleDB responded with status ${res.status}`);
    }

    const data = await res.json();
    const rawTemples = data.temples || data.data || [];
    const total = data.total_count || data.total || data.pagination?.total || data.meta?.total || rawTemples.length;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const templesWithTopFacts = await Promise.all(
      rawTemples.map(async (temple: any) => {
        // 2. Generate slug programmatically if it doesn't exist on templedb response
        const fallbackSlug = temple.slug || generateTempleSlug(temple.name);
        
        let topFact = "Explore historical community insights inside.";
        try {
          const queryIdentifier = fallbackSlug || temple.id?.toString();
          
          const bestFact = await db.collection("templeFacts")
            .find({ $or: [{ templeSlug: queryIdentifier }, { templeId: queryIdentifier }] })
            .sort({ likesCount: -1 })
            .limit(1)
            .toArray();

          if (bestFact.length > 0 && bestFact[0].text) {
            topFact = bestFact[0].text;
          }
        } catch (dbError) {
          console.error(`Failed loading top fact for temple: ${temple.name}`, dbError);
        }

        return {
          ...temple,
          slug: fallbackSlug, // 3. Ensure slug is explicitly populated on the frontend payload
          mostLikedFact: topFact
        };
      })
    );

    return NextResponse.json({
      temples: templesWithTopFacts,
      total
    });

  } catch (error) {
    console.error("TempleDB paginated fetch error:", error);
    return NextResponse.json(
      { error: "Failed fetching temple records from TempleDB." },
      { status: 500 }
    );
  }
}
