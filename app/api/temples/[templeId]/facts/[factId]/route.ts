import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

async function getAuthenticatedUserEmail() {
  return 'sterling@example.com';
}


export async function PUT(request: Request, { params }: { params: any }) {
  const { factId } = params;
  const userEmail = await getAuthenticatedUserEmail();

  try {
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ message: 'Fact text cannot be blank.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: 'User record not found.' }, { status: 404 });
    }

    const fact = await db.collection('templeFacts').findOne({ _id: new ObjectId(factId) });
    if (!fact) {
      return NextResponse.json({ message: 'Fact not found.' }, { status: 404 });
    }

    if (fact.creatorId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized modification attempt.' }, { status: 403 });
    }

    await db.collection('templeFacts').updateOne(
      { _id: new ObjectId(factId) },
      { $set: { text: text.trim(), updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Fact updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('PUT Fact Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: any }) {
  const { factId } = params;
  const userEmail = await getAuthenticatedUserEmail();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user) return NextResponse.json({ message: 'User not found.' }, { status: 404 });

    const fact = await db.collection('templeFacts').findOne({ _id: new ObjectId(factId) });
    if (!fact) return NextResponse.json({ message: 'Fact not found.' }, { status: 404 });

    if (fact.creatorId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized deletion attempt.' }, { status: 403 });
    }

    await db.collection('templeFacts').deleteOne({ _id: new ObjectId(factId) });
    return NextResponse.json({ message: 'Fact removed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Fact Error:', error);
    return NextResponse.json({ message: 'Internal server failure.' }, { status: 500 });
  }
}
