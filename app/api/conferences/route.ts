// /app/api/conferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('organiserEmail');
  if (!email) return NextResponse.json([], { status: 200 });

  const conferences = await prisma.conference.findMany({
    where: { organiserEmail: email },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(conferences);
}
