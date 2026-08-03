// app/api/temples/[templeId]/facts/[factId]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth'; // Safe central authentication checker wrapper

// 1. UPDATE ACTION HANDLER PIPELINE (PUT)
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ templeId: string; factId: string }> }
) {
  // Await the asynchronous params object block cleanly to satisfy modern Next.js compiler parameters
  const { factId } = await params;
  
  // Enforce dynamic active checking sessions loops
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'You must be signed in to modify contributions.' }, { status: 401 });
  }

  if (!ObjectId.isValid(factId)) {
    return NextResponse.json({ message: 'Invalid target identifier structure format.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ message: 'Fact text cannot be blank.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User record not found.' }, { status: 404 });
    }

    const targetId = new ObjectId(factId);
    const fact = await db.collection('templeFacts').findOne({ _id: targetId });
    if (!fact) {
      return NextResponse.json({ message: 'Fact documentation node not found.' }, { status: 404 });
    }

    // Verify profile ownership rules before running update scripts
    if (fact.creatorId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized modification attempt.' }, { status: 403 });
    }

    await db.collection('templeFacts').updateOne(
      { _id: targetId },
      { $set: { text: text.trim(), updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Fact updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('PUT Fact Error:', error);
    return NextResponse.json({ message: 'Internal server lookup exception.' }, { status: 500 });
  }
}

// 2. ERASURE ACTION HANDLER PIPELINE (DELETE)
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ templeId: string; factId: string }> }
) {
  const { factId } = await params;
  
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'You must be signed in to remove contributions.' }, { status: 401 });
  }

  if (!ObjectId.isValid(factId)) {
    return NextResponse.json({ message: 'Invalid target identifier structure format.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "team6project");

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: 'User profile mismatch.' }, { status: 404 });

    const targetId = new ObjectId(factId);
    const fact = await db.collection('templeFacts').findOne({ _id: targetId });
    if (!fact) return NextResponse.json({ message: 'Fact documentation node not found.' }, { status: 404 });

    // Verify profile ownership rules before running deletion scripts
    if (fact.creatorId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized deletion attempt.' }, { status: 403 });
    }

    await db.collection('templeFacts').deleteOne({ _id: targetId });
    return NextResponse.json({ message: 'Fact removed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Fact Error:', error);
    return NextResponse.json({ message: 'Internal server processing failure.' }, { status: 500 });
  }
}
