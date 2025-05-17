import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { role } = await req.json();

  if (!session?.user?.email || !role) {
    return NextResponse.json({ error: "Unauthorized or missing data" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { role },
  });

  return NextResponse.json({ success: true });
}
