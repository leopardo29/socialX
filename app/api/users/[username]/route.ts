import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const session = await auth();

    // Validar la sesión
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }

    // Validar el ID del usuario
    const userId = session.user.id;
    if (!userId || isNaN(+userId)) {
      return NextResponse.json(
        { message: "Invalid user ID", status: "error" },
        { status: 400 }
      );
    }
    const currentUserId = +userId;

    // Consultar usuarios
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        email: true,
        dateOfBirth: true,
        emailVerified: true,
        coverImage: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        followingIds: true,
        hasNotification: true,
        isVerifed: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    // Manejar el caso de no encontrar usuarios
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found", status: "success", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "Users retrieved successfully",
      status: "success",
      data: users,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.error("Prisma error:", err.message);
      return NextResponse.json(
        { message: "Database error", status: "error" },
        { status: 500 }
      );
    }
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", status: "error" },
      { status: 500 }
    );
  }
}