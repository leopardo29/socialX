import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  // Esperamos a que se resuelvan los parámetros
  const { postId } = await params;

  if (!postId) {
    return NextResponse.json(
      { message: "Post Id required", status: "error" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: +postId, // Convertimos postId a número
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found", status: "error" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      post,
    });
  } catch (err) {
    console.error("Error retrieving post:", err);
    return NextResponse.json(
      { message: "Failed to retrieve data", status: "error" },
      { status: 500 }
    );
  }
}
