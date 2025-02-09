"use client";


import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/navigation";
import React from "react";

const TweetList = () => {
  const { data, isLoading } = usePost({});
  const router = useRouter();
  // Ajustamos la lectura de la data:
  const posts = Array.isArray(data) ? data : data?.posts ?? [];
 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="icon" />
      </div>
    );
  }

  if (!posts.length) {
    return <p className="p-4">No hay publicaciones para mostrar</p>;
  }



 

  return (
    <div className="bg-background border dark:border-[rgb(47,51,54)] rounded-xl p-4">
      <h2 className="text-[20px] font-bold">What is happening</h2>

      <div className="w-full h-[25vh] overflow-auto scroll-smooth scrollbar-hide">
        <div className="mt-4 space-y-4">
          {posts.map((post: PostType, index: number) => {
            // Eliminar etiquetas HTML del campo "body"
            const cleanBody = (post.body ?? "").replace(/<[^>]+>/g, "");
            return (
              <React.Fragment key={post.id}>
                <div className="p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={post.user.profileImage || ""}
                        alt={post.user.name}
                      />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/${post.user.username}`}>
                        <p className="font-bold">{post.user.name}</p>
                      </Link>
                      <p className="text-sm text-gray-500">
                        @{post.user.username}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] lg:h-32 text-black dark:text-white overflow-hidden break-words line-clamp-3 font-semibold flex flex-col">
                    {cleanBody.length > 100 ? (
                      <>
                        {cleanBody.slice(0, 100)}
                        <button
                          onClick={() => router.push("/" + post.user.username)}
                          className="text-blue-500 w-full text-start mt-2"
                        >
                          Show more
                        </button>
                      </>
                    ) : (
                      <span className="lg:h-24 text-black dark:text-white overflow-hidden break-words line-clamp-1  font-semibold">
                        {cleanBody || "No hay contenido"}
                      </span>
                    )}
                  </p>
                </div>
               
                {index !== posts.length - 1 && (
                  <hr className="border-gray-200 dark:border-gray-700" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      
      
    </div>
  );
};

export default TweetList;
