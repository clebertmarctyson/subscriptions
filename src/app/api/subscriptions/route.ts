import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true },
    });

    return NextResponse.json(user?.subscriptions || []);
  } catch (error) {
    console.error("Error in GET /api/subscriptions:", error);
    return NextResponse.json(
      { error: "Error fetching subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await req.json();

    // Ensure paymentDate is a valid Date object
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        price: Number(data.price),
        paymentDate: new Date(data.paymentDate),
        status: data.status,
        description: data.description || null,
        logo: data.logo || null,
        userId: user.id,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error in POST /api/subscriptions:", error);
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}
