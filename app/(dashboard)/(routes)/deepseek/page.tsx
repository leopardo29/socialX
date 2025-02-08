"use client";
import React from "react";
import DeepSeekForm from "../../_components/DeepSeekForm";

const DeepSeek = () => {
    const handleGenerate = async (prompt: string): Promise<string> => {
        try {
            const response = await fetch("/api/deepseek", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: prompt }),
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                const errorMessage = data.error || "Error desconocido";
                throw new Error(errorMessage);
            }
    
            // Extraer específicamente la propiedad 'response' del objeto
            return data.response; // Asegúrate que la API realmente devuelve esta propiedad
    
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            throw new Error(message);
        }
    };

    return <DeepSeekForm onGenerate={handleGenerate} />;
};

export default DeepSeek;