import { NextResponse } from "next/server";
import { PrismaClient, ConferenceParticipant, Conference } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true },
    });

    if (!user || user.role !== "participant") {
      return NextResponse.json({ error: "Only participants can register for conferences" }, { status: 403 });
    }

    const allConferences: Conference[] = await prisma.conference.findMany();

    const registeredConferences: ConferenceParticipant[] = await prisma.conferenceParticipant.findMany({
      where: { user: { email: userEmail } },
      include: { conference: true },
    });

    const registeredConferenceIds = registeredConferences.map(
      (c: ConferenceParticipant) => c.conferenceId
    );

    const availableConferences = allConferences.filter(
      (c: Conference) => !registeredConferenceIds.includes(c.id)
    );

    return NextResponse.json({
      registeredConferences: registeredConferences.map((c) => c.conference),
      availableConferences,
    });
  } catch (error) {
    console.error("Failed to fetch conferences:", error);
    return NextResponse.json({ error: "Failed to fetch conferences" }, { status: 500 });
  }
}
