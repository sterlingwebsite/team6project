// app/api/temples/[templeId]/facts/[factId]/like/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth"; // Enforces active user profile verification loops

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ templeId: string; factId: string }> }
) {
  const { templeId, factId } = await params;

  // 1. Enforce validation to verify user session context permissions
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "You must be signed in to upvote historical facts." }, { status: 401 });
  }

  if (!ObjectId.isValid(factId)) {
    return NextResponse.json({ message: "Invalid target identifier structure format." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const targetFactId = new ObjectId(factId);

    // 2. Perform an atomic update operation incrementing the likesCount tracker field value by +1
    const updateResult = await db.collection("templeFacts").findOneAndUpdate(
      { _id: targetFactId },
      { $inc: { likesCount: 1 } },
      { returnDocument: "after" } // Instructs MongoDB to return the updated record document post-execution
    );

    // Safety guard handle if the targeted document artifact was removed/dropped
    if (!updateResult) {
      return NextResponse.json({ message: "The targeted historical fact record could not be found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      templeId,
      factId,
      // Pull the real-time fresh atomic calculation value out of the returned data object shell
      likesCount: updateResult.likesCount || 0
    }, { status: 200 });

  } catch (error) {
    console.error(`POST /api/temples/${templeId}/facts/${factId}/like system crash:`, error);
    return NextResponse.json({ error: "Internal processing database pipeline execution fault." }, { status: 500 });
  }
}
