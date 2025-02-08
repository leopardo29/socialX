"use client";

import React, { useCallback } from "react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/spinner";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useUploadcare from "@/hooks/useUploadcare";
import { Button } from "@/components/ui/button";
import DraftEditor from "@/components/draft-editor";
import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "@/hooks/use-toast";
import { addComment } from "../../../actions/comment.action";
import { EditorState } from "draft-js";

import useUploadcareVideo from "@/hooks/useUploadcareVideo";
import Image from "next/image";
import UploadMediaButton from "@/components/upload-button";
import GifButton from "@/components/gif";

import useTenorGifsCare from "@/hooks/useTenorGifs";
import { Modal, Dialog, DialogContent } from '@mui/material';

interface PropsType {
    placeholder: string;
    isComment?: boolean;
    postUsername?: string;
    postId?: number;
    open: boolean;
    onClose: () => void;
  }
  const PostFormModal: React.FC<PropsType> = ({
    placeholder,
    isComment,
    postUsername,
    postId,
    open,
    onClose,
  }) => {
    // 🔴 Añade estos nuevos estados para GIFs
    const {
      uploadGif,
      gifUploadedUrls,
      loading: uploadingGif,
      clearFile: clearGif,
   
    } = useTenorGifsCare();
  
    // 🔴 Función para subir GIFs
  
    const { uploadFile, uploadedUrl, uploading, clearFile } = useUploadcare();
    const {
      uploadVideo,
      uploadedUrl: uploadedVideoUrl,
      uploading: uploadingVideo,
      clearVideo,
    } = useUploadcareVideo(); // Hook para videos
    const { data, isLoading } = useCurrentUserContext();
    const queryClient = useQueryClient();
  
    const [loading, setLoading] = React.useState(false);
    const [editorState, setEditorState] = React.useState(
      EditorState.createEmpty()
    );
  
    const currentUser = data?.currentUser ?? ({} as UserType);
  
    const formSchema = z.object({
      body: z.string(),
    });
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        body: "",
      },
    });

    const handleClose = useCallback(() => {
        onClose();
        clearGif();
        setEditorState(EditorState.createEmpty());
        form.reset();
        clearFile();
        clearVideo();
      }, [onClose, clearGif, form, clearFile, clearVideo]); // Agregamos todas las dependencias necesarias
      
  
    // 🔴 Actualiza la función onSubmit
    const onSubmit = useCallback(
        async (values: z.infer<typeof formSchema>) => {
          try {
            setLoading(true);
            if (isComment && postId) {
              await addComment({
                body: values.body,
                postId: postId,
                commentImage: uploadedUrl || "",
                commentVideo: uploadedVideoUrl || "",
                commentGif: gifUploadedUrls || "", // 🎯 Nuevo campo
              });
              console.log("📝 Comentario enviado con GIF:");
              toast({
                title: "Success",
                description: "Comment created successfully",
                variant: "default",
              });
              queryClient.invalidateQueries({
                queryKey: isComment ? ["post", postId] : ["posts", "allposts"],
              });
            } else {
              await axios.post(`${BASE_URL}/api/posts`, {
                body: values.body,
                postImage: uploadedUrl || "",
                postVideo: uploadedVideoUrl || "",
                postGif: gifUploadedUrls || "", // 🎯 Nuevo campo
              });
              console.log("📝 Post enviado con GIF:", gifUploadedUrls);
              toast({
                title: "Success",
                description: "Post created successfully",
                variant: "default",
              });
              queryClient.invalidateQueries({
                queryKey: ["posts", "allposts"],
              });
            }
            handleClose(); // 🎯 Limpia el estado del GIF
      
          } catch {
            console.error("❌ Error en la creación del post:");
            toast({
              title: "Error",
              description: "Failed to create post or comment",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        },
        [
          isComment, 
          postId, 
          queryClient, 
          uploadedUrl, 
          uploadedVideoUrl, 
          gifUploadedUrls, 
          handleClose, // Solo dejamos handleClose aquí porque es la que afecta el resultado de onSubmit
        ]
      );
    
  
    const handleUploadFile = useCallback(
      async (file: File) => {
        if (!file) return;
        await uploadFile(file);
      },
      [uploadFile]
    );
  
    const handleUploadVideo = useCallback(
      async (file: File) => {
        if (!file) return;
        await uploadVideo(file);
      },
      [uploadVideo]
    );
  
    const handleUploadGif = useCallback(
      async (file: File) => {
        if (!file) return;
        await uploadGif(file);
      },
      [uploadGif]
    );
    

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="post-form-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
        }}
      >
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              minWidth: '600px',
              maxHeight: '80vh',
              overflow: 'hidden',
            },
          }}
        >
          <DialogContent dividers sx={{ p: 0 }}>
            <div className="dark:bg-[#000000]  w-[100%] lg:w-full flex items-center justify-center">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex lg:h-full lg:w-full 
              flex-col items-center justify-center p-3 relative w-[60%]  "
          >
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <div className="w-full px-4 flex pb-11 gap-4">
               
                  
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300  absolute right-0 top-0 font-semibold text-md bg-slate-700 rounded-full lg:w-8 lg:h-8 flex items-center justify-center h-5 w-5"
                  >
                    x
                  </button>
                

                <div className="shrink-0">
                  <Avatar>
                    <AvatarImage
                      src={currentUser?.profileImage || ""}
                      alt={currentUser?.username || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="font-bold">
                      {currentUser?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-1 flex-1 lg:w-full  p-2 text-white overflow-hidden break-words line-clamp-6">
                  {isComment && (
                    <div className="flex items-center">
                      <p className="!text-[#959fa8] text-sm font-normal">
                        Replying to{" "}
                        <Link className="!text-primary" href={`/${postUsername}`}>
                          @{postUsername}
                        </Link>
                      </p>
                    </div>
                  )}
  
                  <div
                    className="min-h-6 !max-h-80 
                                      overflow-auto overflow-x-hidden mb-3"
                  >
                    <DraftEditor
                      placeholder={placeholder}
                      wrapperClassName="!min-h-6 !max-h-80 
                        !border-none w-full"
                      editorClassName="placeholder:text-muted-foreground 
                        outline-0 px-0 
                        focus-visible:outline-none 
                        text-[18px] resize-none 
                        !py-0 w-full 
                        focus:border-0 !border-none "
                      editorState={editorState}
                      setEditorState={setEditorState}
                      onChange={(html) => {
                        form.setValue("body", html);
                      }}
                    />
                  </div>
                  {/* IMAGENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN */}
                  <div className="flex items-center">
                    {uploadedUrl && (
                      <div className="lg:w-[20em] lg:h-[20em] h-[10em] w-full relative rounded-md border overflow-hidden">
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute top-0 right-0 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                        <Image
                          src={uploadedUrl}
                          width={400}
                          height={400}
                          alt=""
                          className="w-full h-full rounded-md object-cover"
                        />
                        {uploading && (
                          <div className="absolute inset-0 w-full h-full bg-gray-950/10 dark:bg-gray-950/30 flex items-center justify-center">
                            <Spinner size="lg" />
                          </div>
                        )}
                      </div>
                    )}
  
                    {uploadedVideoUrl && (
                      <div className="lg:w-[20em] lg:h-[20em] h-[10em] w-auto relative rounded-md border overflow-hidden">
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute top-0 right-0 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                        <video
                          src={uploadedVideoUrl}
                          width={44}
                          height={44}
                          controls
                          className="w-full h-full rounded-md object-cover"
                        />
                        {uploadingVideo && (
                          <div className="absolute inset-0 w-full h-full bg-gray-950/10 dark:bg-gray-950/30 flex items-center justify-center">
                            <Spinner size="lg" />
                          </div>
                        )}
                      </div>
                    )}
                    {/* 🎯 Añade visualización de GIF */}
                    {gifUploadedUrls && (
                      <div className="lg:w-[20em] lg:h-[20em] h-[10em] w-auto relative rounded-md border overflow-hidden">
                        <button
                          type="button"
                          onClick={clearGif}
                          className="absolute top-0 right-0 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
  
                        <video
                          src={gifUploadedUrls}
                          muted
                          loop
                          autoPlay
                          playsInline
                          disablePictureInPicture
                          disableRemotePlayback
                          controls={false}
                          className="w-full h-full object-cover rounded-lg transition-opacity group-hover:opacity-90"
                          style={{
                            objectFit: "cover",
                            backgroundColor: "transparent",
                          }}
                          controlsList="nodownload nofullscreen noremoteplayback"
                        />
  
                        {uploading && (
                          <div className="absolute inset-0 bg-gray-950/10 dark:bg-gray-950/30 flex items-center justify-center">
                            <Spinner size="lg" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <hr
                    className="px-3  h-[0.5px] w-full opacity-0
                   dark:border-[rgb(34,37,40)] mb-1 transition
                  "
                  />
                  <div
                    className="w-full flex items-center
                                       justify-between"
                  >
                    <div className="flex items-center flex-1">
                      <UploadMediaButton
                        disabled={uploading || uploadingVideo }
                        onFileSelect={(file) => {
                          if (file.type.startsWith("image/")) {
                            handleUploadFile(file);
                          } else if (file.type.startsWith("video/")) {
                            handleUploadVideo(file);
                          }
                        }}
                      />
                      {/* 🎯 Añade el GifButton aquí */}
                      <GifButton
                        disabled={uploadingGif}
                        onFileSelect={(file) => {
                          if (file.type.startsWith("image/")) {
                            handleUploadGif(file);
                          } else if (file.type.startsWith("video/")) {
                            handleUploadGif(file);
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="brandPrimary"
                      size="brandsm"
                      disabled={
                        loading ||
                        uploading ||
                        uploadingVideo ||
                        uploadingGif ||
                        !form?.getValues()?.body
                      }
                      className="
                            !h-auto
                            !text-white
                            cursor-pointer
                            font-semibold
                            text-base"
                    >
                      {loading ? (
                        <Spinner size="default" />
                      ) : isComment ? (
                        "Reply"
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
            </div>
          </DialogContent>
        </Dialog>
        </Modal>
        

    );
  };
  
  export default PostFormModal;