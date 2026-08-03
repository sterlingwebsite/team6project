// app/api/temples/all/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const temples = await db.collection("temples")
      .find({})
      .project({ name: 1, city: 1, country: 1, slug: 1 })
      .sort({ name: 1 })
      .toArray();

    const formattedTemples = temples.map(t => ({
      _id: t._id.toString(),
      name: t.name,
      location: `${t.city || ""}${t.city && t.country ? ", " : ""}${t.country || ""}`
    }));

    return NextResponse.json(formattedTemples, { 
      status: 200,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" }
    });

  } catch (error) {
    console.error("GET /api/temples/all error:", error);
    return NextResponse.json({ error: "Failed to extract directory lookup indices." }, { status: 500 });
  }
}
