// app/api/temples/[templeId]/facts/[factId]/like/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ templeId: string; factId: string }> }
) {
  const { templeId, factId } = await params;

  // 1. Enforce active user session verification loops
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "You must be signed in to vote on historical facts." }, { status: 401 });
  }

  if (!ObjectId.isValid(factId)) {
    return NextResponse.json({ message: "Invalid target identifier structure format." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");
    const targetFactId = new ObjectId(factId);

    // 2. Fetch the logged-in profile record from your database
    const userRecord = await db.collection("users").findOne({ email: session.user.email });
    if (!userRecord) {
      return NextResponse.json({ message: "User account identity mismatch error." }, { status: 404 });
    }

    // 3. Look up the targeted historical fact item node
    const fact = await db.collection("templeFacts").findOne({ _id: targetFactId });
    if (!fact) {
      return NextResponse.json({ message: "The targeted historical fact record could not be found." }, { status: 404 });
    }

    // Guard: Prevent creator self-voting
    if (fact.creatorId.toString() === userRecord._id.toString()) {
      return NextResponse.json({ 
        message: "Validation Flag: You cannot vote on historical insights that you contributed yourself." 
      }, { status: 403 });
    }

    // 4. Query your junction table to check for an existing vote record
    const existingLike = await db.collection("factLikes").findOne({
      userId: userRecord._id,
      factId: targetFactId
    });

    // --- TOGGLE PIPELINE ACTION ---
    if (existingLike) {
      // ACTION A: UNLIKE OPERATION
      // Erase the tracking record and atomically decrement the main tally by -1
      await db.collection("factLikes").deleteOne({ _id: existingLike._id });

      const updateResult = await db.collection("templeFacts").findOneAndUpdate(
        { _id: targetFactId },
        { $inc: { likesCount: -1 } },
        { returnDocument: "after" }
      );

      return NextResponse.json({
        success: true,
        toggledAction: "unliked",
        likesCount: updateResult?.likesCount || 0
      }, { status: 200 }); // Returns 200 OK cleanly
    }

    // ACTION B: LIKE OPERATION
    // If no previous record is found, log a new vote and atomically increment the main tally by +1
    await db.collection("factLikes").insertOne({
      userId: userRecord._id,
      factId: targetFactId,
      createdAt: new Date()
    });

    const updateResult = await db.collection("templeFacts").findOneAndUpdate(
      { _id: targetFactId },
      { $inc: { likesCount: 1 } },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      toggledAction: "liked",
      likesCount: updateResult?.likesCount || 0
    }, { status: 200 });

  } catch (error) {
    console.error(`POST /api/temples/${templeId}/facts/${factId}/like system crash:`, error);
    return NextResponse.json({ error: "Internal processing database pipeline execution fault." }, { status: 500 });
  }
}
