import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { email, title, committee } = await req.json();

    // Validate input
    if (!email || !title || !committee) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create executive board entry
    const exec = await prisma.executiveBoard.create({
      data: {
        userId: user.id,
        title,
        committee,
        conferenceId: id,
      },
    });

    return NextResponse.json(exec);
  } catch (error) {
    console.error('[EXEC_BOARD_ADD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const execs = await prisma.executiveBoard.findMany({
    where: { conferenceId: params.id },
    include: { user: true },
  });

  return NextResponse.json(execs);
}
