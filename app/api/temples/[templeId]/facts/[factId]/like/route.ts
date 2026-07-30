import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ templeId: string; factId: string }> }
) {
  const { templeId, factId } = await params;

  return NextResponse.json({
    success: true,
    templeId,
    factId,
    likesCount: 13,
  });
}