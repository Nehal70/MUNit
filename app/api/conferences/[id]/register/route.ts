import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already registered for this conference
    const existingRegistration = await prisma.conferenceParticipant.findFirst({
      where: {
        userId: user.id,
        conferenceId: params.id,
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this conference" }, { status: 409 });
    }

    // Register the user for the conference
    await prisma.conferenceParticipant.create({
      data: {
        userId: user.id,
        conferenceId: params.id,
        committee: "", // Leave empty for now, you can add a committee selection later
      },
    });

    return NextResponse.json({ message: "Successfully registered" });
  } catch (error) {
    console.error("Failed to register for conference:", error);
    return NextResponse.json({ error: "Failed to register for conference" }, { status: 500 });
  }
}
