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

    const userRecord = await db.collection("users").findOne({ email: session.user.email });
    if (!userRecord) {
      return NextResponse.json({ message: "User account identity mismatch error." }, { status: 404 });
    }

    const fact = await db.collection("templeFacts").findOne({ _id: targetFactId });
    if (!fact) {
      return NextResponse.json({ message: "The targeted historical fact record could not be found." }, { status: 404 });
    }

    if (fact.creatorId.toString() === userRecord._id.toString()) {
      return NextResponse.json({ 
        message: "Validation Flag: You cannot vote on historical insights that you contributed yourself." 
      }, { status: 403 });
    }

    const existingLike = await db.collection("factLikes").findOne({
      userId: userRecord._id,
      factId: targetFactId
    });

    if (existingLike) {
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
      }, { status: 200 });
    }

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
