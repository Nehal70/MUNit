import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
<<<<<<< Updated upstream
import { authOptions } from '../../auth/[...nextauth]/route';
=======
import { authOptions } from "../auth/[...nextauth]/route"; // adjust if needed
>>>>>>> Stashed changes
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    committeePref1,
    portfolioPref1,
    committeePref2,
    portfolioPref2,
    committeePref3,
    portfolioPref3,
    remarks,
  } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

<<<<<<< Updated upstream
    const existing = await prisma.conferenceParticipant.findUnique({
      where: {
        userId_conferenceId: {
          userId: user.id,
          conferenceId: params.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }

=======
>>>>>>> Stashed changes
    const participant = await prisma.conferenceParticipant.create({
      data: {
        userId: user.id,
        conferenceId: params.id,
        committeePref1,
        portfolioPref1,
        committeePref2,
        portfolioPref2,
        committeePref3,
        portfolioPref3,
        remarks,
      },
    });

    return NextResponse.json(participant, { status: 201 });
<<<<<<< Updated upstream
  } catch (error) {
=======
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }

>>>>>>> Stashed changes
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
