import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://www.templedb.org/api/temples");
    const data = await res.json();

    return NextResponse.json(data.temples);
  } catch (error) {
    console.error("TempleDB fetch error:", error);
    return NextResponse.json(
      { error: "Failed fetching temple records from TempleDB." },
      { status: 500 }
    );
  }
}
