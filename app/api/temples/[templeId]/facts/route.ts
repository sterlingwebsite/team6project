import { NextResponse } from "next/server";

const templeFacts = [
  {
    id: "1",
    factText: "The temple was dedicated as a place of worship and service.",
    likesCount: 12,
  },
  {
    id: "2",
    factText: "Many members around the world visit temples for spiritual experiences.",
    likesCount: 25,
  },
  {
    id: "3",
    factText: "Temples are built to provide opportunities for sacred ordinances.",
    likesCount: 18,
  },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ templeId: string }> }
) {
  const { templeId } = await params;

  return NextResponse.json({
    templeId,
    facts: templeFacts,
  });
}