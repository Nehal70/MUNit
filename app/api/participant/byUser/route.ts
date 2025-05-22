import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conferenceId = searchParams.get('conferenceId');
  const email = searchParams.get('email');

  if (!conferenceId || !email) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const participant = await prisma.conferenceParticipant.findUnique({
      where: {
        userId_conferenceId: {
          userId: user.id,
          conferenceId,
        },
      },
      select: {
        id: true,
        committee: true,
        portfolio: true,
        committeePref1: true,
        portfolioPref1: true,
        committeePref2: true,
        portfolioPref2: true,
        committeePref3: true,
        portfolioPref3: true,
        remarks: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error('[GET_PARTICIPANT_BY_USER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
