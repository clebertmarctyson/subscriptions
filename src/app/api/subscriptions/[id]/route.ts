import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Subscription } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: Subscription = await req.json();

    // Verify subscription ownership
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (existingSubscription.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        name: data.name,
        price: Number(data.price),
        paymentDate: data.paymentDate,
        status: data.status,
        cancelUrl: data.cancelUrl,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error in PUT /api/subscriptions:", error);
    return NextResponse.json(
      { error: "Error updating subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify subscription ownership
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (subscription.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subscription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/subscriptions:", error);
    return NextResponse.json(
      { error: "Error deleting subscription" },
      { status: 500 }
    );
  }
}
