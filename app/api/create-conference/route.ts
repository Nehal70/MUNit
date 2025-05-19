import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const fee = parseFloat(formData.get("fee") as string);
    const paymentDetails = formData.get("paymentDetails") as string;
    const venue = formData.get("venue") as string;
    const contactDetails = formData.get("contactDetails") as string;
    const committees = JSON.parse(formData.get("committees") as string);
    const agendas = JSON.parse(formData.get("agendas") as string);
    const committeeMatrix = JSON.parse(formData.get("committeeMatrix") as string);

    const logoFile = formData.get("logo") as File | null;
    const logoBuffer = logoFile ? Buffer.from(await logoFile.arrayBuffer()) : null;

    await prisma.conference.create({
      data: {
        organiserEmail: session.user.email,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        participationFee: fee,
        paymentDetails,
        venue,
        contactDetails,
        logo: logoBuffer,
        committees,
        agendas,
        committeeMatrix,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create conference error:", error);
    return NextResponse.json({ error: "Failed to create conference" }, { status: 500 });
  }
}

