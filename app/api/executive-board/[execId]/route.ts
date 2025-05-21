import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { execId: string } }
) {
  const { title, committee } = await req.json();

  const updated = await prisma.executiveBoard.update({
    where: { id: params.execId },
    data: { title, committee },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { execId: string } }
) {
  await prisma.executiveBoard.delete({
    where: { id: params.execId },
  });

  return NextResponse.json({ success: true });
}
