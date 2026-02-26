
import { GoogleGenAI, Type } from "@google/genai";
import { Recommendation } from "../types";

export const getCourseRecommendation = async (selectedWords: string[]): Promise<Recommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Baseado nas seguintes palavras que descrevem o perfil de um estudante: ${selectedWords.join(', ')}. 
  Sugira um curso universitário ideal e explique o porquê. Responda em português.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            perfil_dominante: { type: Type.STRING, description: "Nome do perfil dominante" },
            cursos_recomendados: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  curso: { type: Type.STRING },
                  badge: { type: Type.STRING },
                  area: { type: Type.STRING },
                  grau: { type: Type.STRING },
                  semestres: { type: Type.NUMBER }
                },
                required: ["curso", "area", "grau", "semestres"]
              },
              description: "Lista de cursos recomendados com detalhes" 
            },
            resumo_executivo: { type: Type.STRING, description: "Um resumo do perfil" },
            relatorio_completo: { type: Type.STRING, description: "Um relatório detalhado" }
          },
          required: ["perfil_dominante", "cursos_recomendados", "resumo_executivo", "relatorio_completo"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as Recommendation;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback recommendation
    return {
      perfil_dominante: "Generalista",
      cursos_recomendados: [
        { curso: "Administração", badge: "🚀 Versátil", area: "Gestão", grau: "Bacharelado", semestres: 8 },
        { curso: "Marketing", badge: "💡 Criativo", area: "Comunicação", grau: "Bacharelado", semestres: 8 }
      ],
      resumo_executivo: "Você possui um perfil versátil e adaptável.",
      relatorio_completo: "Baseado em suas escolhas, você se daria bem em áreas que exigem visão sistêmica e liderança."
    };
  }
};
