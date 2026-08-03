// app/api/temples/[templeId]/facts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ templeId: string }> }
) {
  const { templeId } = await params;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const queryConditions: any[] = [{ templeSlug: templeId }, { templeId: templeId }];
    if (ObjectId.isValid(templeId)) {
      queryConditions.push({ templeId: new ObjectId(templeId) });
    }

    const facts = await db.collection("templeFacts")
      .find({ $or: queryConditions })
      .sort({ likesCount: -1 })
      .toArray();

    const normalizedFacts = facts.map(fact => ({
      _id: fact._id.toString(),
      templeId: templeId,
      text: fact.text || fact.factText || "",
      likesCount: fact.likesCount || 0,
      createdAt: fact.createdAt || new Date().toISOString()
    }));

    return NextResponse.json(normalizedFacts, { status: 200 });

  } catch (error) {
    console.error(`GET /api/temples/${templeId}/facts error:`, error);
    return NextResponse.json({ error: "Failed to extract temple historical documentation." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templeId: string }> }
) {
  const { templeId } = await params;
  
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "You must be signed in to add temple facts." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const textContent = body.text?.toString().trim();

    if (!textContent || textContent.length < 5) {
      return NextResponse.json({ error: "Fact notes description must contain at least 5 character variables." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const userRecord = await db.collection("users").findOne({ email: session.user.email });
    if (!userRecord) {
      return NextResponse.json({ message: "User account identity mismatch error." }, { status: 404 });
    }

    const newFactDocument = {
      creatorId: userRecord._id,
      templeId: ObjectId.isValid(templeId) ? new ObjectId(templeId) : templeId,
      templeSlug: templeId,
      text: textContent,
      likesCount: 0,
      createdAt: new Date()
    };

    const result = await db.collection("templeFacts").insertOne(newFactDocument);

    return NextResponse.json({ 
      message: "Historical documentation contribution added successfully.", 
      id: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error(`POST /api/temples/${templeId}/facts system crash:`, error);
    return NextResponse.json({ error: "Internal processing database pipeline execution fault." }, { status: 500 });
  }
}
