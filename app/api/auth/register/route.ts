// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ message: "All input data fields are mandatory." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ message: "An account with this email address already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    return NextResponse.json({ message: "Account profile created successfully.", id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("API User Registration Pipeline crash:", err);
    return NextResponse.json({ message: "Internal server processing failure." }, { status: 500 });
  }
}
