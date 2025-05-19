import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // your Prisma client

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const participants = await prisma.conferenceParticipant.findMany({
      where: { conferenceId: params.id },
      include: {
        user: true, // to include user details like name and email
      },
    });

    // flatten user data for frontend use
    const cleanData = participants.map((p) => ({
      id: p.id,
      name: p.user.name,
      email: p.user.email,
      committee: p.committee,
      portfolio: p.portfolio,
      committeePref1: p.committeePref1,
      portfolioPref1: p.portfolioPref1,
      committeePref2: p.committeePref2,
      portfolioPref2: p.portfolioPref2,
      committeePref3: p.committeePref3,
      portfolioPref3: p.portfolioPref3,
      remarks: p.remarks,
    }));

    return NextResponse.json(cleanData);
  } catch (error) {
    console.error('[GET_PARTICIPANTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

