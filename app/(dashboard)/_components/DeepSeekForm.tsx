"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import AttachFileIcon from '@mui/icons-material/AttachFile';


interface DeepSeekFormProps {
  initialQuery?: string;
  onGenerate: (query: string) => Promise<string>;
}

const DeepSeekForm = ({ initialQuery = "", onGenerate }: DeepSeekFormProps) => {
  const [prompt, setPrompt] = useState(initialQuery);
  const [responses, setResponses] = useState<{ text: string; type: string; content?: Blob | File }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponses((prev) => [{ text: prompt, type: "user" }, ...prev]);
    setPrompt("");

    try {
        // Aquí ya deberías recibir directamente el string
        const aiResponse = await onGenerate(prompt);
        setResponses((prev) => [{ text: aiResponse, type: "ai" }, ...prev]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setResponses((prev) => [
            { text: `❌ Error: ${errorMessage}`, type: "error" },
            ...prev,
        ]);
    } finally {
        setIsLoading(false);
    }
};
  const handleFileUpload = (type: 'file' | 'image') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'file' ? '*' : 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setResponses(prev => [{
          text: `${type === 'file' ? 'Archivo' : 'Imagen'} subido: ${file.name}`,
          type: "user",
          content: file
        }, ...prev]);
      }
    };
    input.click();
  };

  const handlePhotoTake = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
              if (blob) {
                setResponses(prev => [{
                  text: "Foto tomada",
                  type: "user",
                  content: blob
                }, ...prev]);
              }
              stream.getTracks().forEach(track => track.stop());
            }, 'image/jpeg');
          }
        }, 1500);
      })
      .catch(error => {
        console.error('Error al acceder a la cámara:', error);
        setResponses(prev => [{ text: "Error al tomar foto", type: "error" }, ...prev]);
      });
  };

  const renderMessageContent = (msg: { text: string; type: string; content?: Blob | File }) => {
    if (msg.content) {
      const url = URL.createObjectURL(msg.content);
      return (
        <div className="mt-2">
          <p>{msg.text}</p>
          <div className="relative w-full h-48 mt-2">
            <Image
              src={url}
              alt="User content"
              fill
              className="object-contain"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          </div>
        </div>
      );
    }
    return <p>{msg.text}</p>;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
        <h1 className="text-xl font-semibold">Grok 2</h1>

        <div className="w-full h-96 overflow-y-auto flex flex-col-reverse space-y-4 space-y-reverse scrollbar-hide p-2">
          {responses.map((msg, index) => (
            <div key={index} className="flex w-full">
              <div className={`flex items-center w-1/2 ${msg.type === "user" ? "mr-auto" : "ml-auto"}`}>
                <div className={`p-4 rounded-lg shadow-lg ${
                  msg.type === "user" ? "bg-gray-700" : 
                  msg.type === "error" ? "bg-red-900" : "bg-gray-800"
                }`}>
                  {renderMessageContent(msg)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleGenerate} className="w-full ">
          <div className="relative bg-gray-800  rounded-xl flex items-center w-full flex-col p-8">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-16 bg-transparent border-0 text-white placeholder-gray-500 focus:ring-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="absolute right-8  text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ChevronRight className="h-10 w-10 -rotate-90" />
              )}
            </Button>
            <div className="flex justify-center space-x-2 mt-4">
                <div className="">

                <AttachFileIcon className="h-6 w-6 rotate-45" />
          <Button onClick={() => handleFileUpload('file')} variant="ghost" className='p-1'>Upload File</Button>
                </div>
          <Button onClick={() => handleFileUpload('image')} variant="ghost">Upload Image</Button>
          <Button onClick={handlePhotoTake} variant="ghost">Take a photo</Button>
        </div>
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default DeepSeekForm;