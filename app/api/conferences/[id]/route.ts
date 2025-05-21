import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const conference = await prisma.conference.findUnique({
    where: { id: params.id },
  });

  if (!conference) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(conference);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updated = await prisma.conference.update({
      where: { id: params.id },
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        participationFee: body.participationFee,
        venue: body.venue,
        contactDetails: body.contactDetails,
        paymentDetails: body.paymentDetails,
        logo: body.logo,
        committees: body.committees,
        agendas: body.agendas,
        committeeMatrix: body.committeeMatrix,
        organiserEmail: body.organiserEmail,

        // ✅ New fields for announcements and policy
        announcements: body.announcements,
        policyText: body.policyText,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PUT_CONFERENCE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


