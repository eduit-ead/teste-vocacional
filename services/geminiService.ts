
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
            course: { type: Type.STRING, description: "Nome do curso recomendado" },
            description: { type: Type.STRING, description: "Uma breve descrição do curso" },
            reason: { type: Type.STRING, description: "Por que este curso combina com as palavras selecionadas" }
          },
          required: ["course", "description", "reason"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as Recommendation;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback recommendation
    return {
      course: "Administração de Empresas",
      description: "Um curso versátil focado em gestão e liderança.",
      reason: "Devido à variedade de seus interesses, um curso generalista e estratégico como Administração pode ser a base perfeita para sua carreira."
    };
  }
};
