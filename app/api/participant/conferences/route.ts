// app/api/participant/conferences/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch a single user for demonstration
    const user = await prisma.user.findFirst(); // Just grabs the first user

    // Fetch all conferences (no user filtering for now)
    const conferences = await prisma.conference.findMany();

    return NextResponse.json({
      name: user?.name || "Participant",
      conferences: conferences,
    });
  } catch (error) {
    console.error("Failed to fetch conferences:", error);
    return NextResponse.json({ error: "Failed to fetch conferences" }, { status: 500 });
  }
}

