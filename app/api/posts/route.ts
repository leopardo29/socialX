import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const session = await auth(); // Obtiene la sesión del usuario
      if (!session?.user?.id) {
        return NextResponse.json(
          { message: "Not authenticated", status: "error" },
          { status: 401 }
        );
      }
  
      const userId = +session?.user?.id; // Convierte el id del usuario a número
      const requestBody = await request.json(); // Obtiene los datos de la solicitud
      const { body, postImage, postVideo, postGif } = requestBody; // Extrae los valores
  
      if (!body) {
        return NextResponse.json(
          { message: "Post content required", status: "error" },
          { status: 400 }
        );
      }
  
      // Crear el post y guardar la URL del GIF
      const post = await prisma.post.create({
        data: {
          body: body, // Cuerpo del post
          postImage: postImage, // Imagen del post (si aplica)
          postVideo: postVideo, // Video del post (si aplica)
          postGif: postGif, // GIF del post (si aplica)
          userId: userId, // Id del usuario que creó el post
          
        },
      });
  
  

    return NextResponse.json(
      {
        data: post,
        message: "Post created successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch  {
    console.error("Error al crear el post:");
    return NextResponse.json(
      {
        message: "Failed to create post",
        status: "error",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.get("userId");
    let posts;

    if (userId) {
      posts = await prisma.post.findMany({
        where: {
          userId: +userId,
        },
        include: {
          user: {
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
              subscription: {
                select: {
                  plan: true,
                },
              },
            },
          },
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          user: {
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
              
              subscription: {
                select: {
                  plan: true,
                },
              },
            },
          },
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({
      status: "success",
      posts,
    });
  } catch  {
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
