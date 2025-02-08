import React from "react";
import { toast } from "./use-toast";

const useUploadcareVideo = () => {
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const uploadVideo = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("UPLOADCARE_PUB_KEY", process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!);
      formData.append("UPLOADCARE_STORE", "1");
      formData.append("file", file);

      const response = await fetch("https://upload.uploadcare.com/base/", { method: "POST", body: formData });
      const result = await response.json();

      if (!result.file) {
        toast({ title: "Error", description: "Video upload failed", variant: "destructive" });
        return null;
      }

      const videoUrl = `https://ucarecdn.com/${result.file}/`;
      setUploadedUrl(videoUrl);
      toast({ title: "Success", description: "Video uploaded successfully", variant: "default" });
      return videoUrl;
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Video upload failed", variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearVideo = () => setUploadedUrl(null);

  return { uploadVideo, uploadedUrl, uploading, clearVideo };
};

export default useUploadcareVideo;
