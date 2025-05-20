import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conferenceId = searchParams.get('conferenceId');
  const email = searchParams.get('email');

  if (!conferenceId || !email) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const participant = await prisma.conferenceParticipant.findFirst({
      where: {
        conferenceId,
        user: {
          email,
        },
      },
    });

    return NextResponse.json({ isRegistered: !!participant });
  } catch (error) {
    console.error('[IS_REGISTERED_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

