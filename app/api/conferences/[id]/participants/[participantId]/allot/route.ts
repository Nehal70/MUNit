import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { id: string; participantId: string };
  }
) {
  try {
    const { committee, portfolio } = await req.json();

    // Basic validation
    if (!committee || !portfolio) {
      return NextResponse.json(
        { error: 'Missing committee or portfolio' },
        { status: 400 }
      );
    }

    const updated = await prisma.conferenceParticipant.update({
      where: {
        id: params.participantId,
      },
      data: {
        committee,
        portfolio,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('[ALLOT_PARTICIPANT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
