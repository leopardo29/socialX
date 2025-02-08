import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // 1. Validación de entrada
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query inválida" },
        { status: 400 }
      );
    }

    console.log("Enviando solicitud a Gemini con query:", query);

    // 2. Configuración mejorada del fetch con el endpoint de Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: query.substring(0, 500) }] // Limita caracteres
          }]
        }),
      }
    );

    console.log("Respuesta de Gemini recibida:", response.status);

    // 3. Manejo detallado de errores
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Gemini:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Error en autenticación" },
        { status: response.status }
      );
    }

    // 4. Validación de respuesta
    const data = await response.json();
    console.log("Datos recibidos de Gemini:", data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Estructura de respuesta inválida");
    }

    return NextResponse.json({ response: String(data.candidates[0].content.parts[0].text) });


  } catch (error: unknown) {
    console.error("Error interno:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error de servidor" },
      { status: 500 }
    );
  }
}
