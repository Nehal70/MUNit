// /app/api/conferences/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // adjust path as needed

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const conference = await prisma.conference.findUnique({
    where: { id: params.id },
  });

  if (!conference) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(conference);
}
