import React, { useCallback } from "react";
import { toast } from "./use-toast";
import { uploadFileAction } from "@/app/actions/upload.action";

const useUploadcare = () => {
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("UPLOADCARE_PUB_KEY", process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!);
      formData.append("UPLOADCARE_STORE", "1");
      formData.append("file", file);

      const result = await uploadFileAction(formData);
      if (!result?.uploadedUrl) {
        toast({ title: "Error", description: result?.message || "Upload failed", variant: "destructive" });
        return null;
      }

      setUploadedUrl(result.uploadedUrl);
      toast({ title: "Success", description: "Upload successfully", variant: "default" });
      return result.uploadedUrl;
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Upload failed", variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const clearFile = useCallback(() => setUploadedUrl(null), []);

  return { uploadFile, uploadedUrl, uploading, clearFile };
};

export default useUploadcare;
