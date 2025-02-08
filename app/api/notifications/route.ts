import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = +session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { hasNotification: false },
    });

    return NextResponse.json(
      { data: notifications, message: "Notifications fetched successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en GET /api/notifications:", error);
    
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        ...(process.env.NODE_ENV === "development" && { 
          error: error instanceof Error ? error.message : "Unknown error" 
        })
      },
      { status: 500 }
    );
  }
}