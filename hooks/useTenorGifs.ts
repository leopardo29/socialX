import React, { useCallback } from "react";
import { toast } from "./use-toast";
import { uploadFileAction } from "@/app/actions/upload.action";


const useTenorGifsCare = () => {
  const [gifUploadedUrls, setGifUploadedUrls] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const uploadGif = useCallback(async (file: File): Promise<string | null> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("UPLOADCARE_PUB_KEY", process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!);
      formData.append("UPLOADCARE_STORE", "1");
      formData.append("file", file);

      const result = await uploadFileAction(formData);
      if (!result?.uploadedUrl) {
        toast({ title: "Error", description: result?.message || "Upload failed", variant: "destructive" });
        return null;
      }

      setGifUploadedUrls(result.uploadedUrl);
      toast({ title: "Success", description: "Upload successfully", variant: "default" });
      return result.uploadedUrl;
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Upload failed", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFile = useCallback(() => setGifUploadedUrls(null), []);

  return { uploadGif,gifUploadedUrls, loading, clearFile };
};

export default useTenorGifsCare;
